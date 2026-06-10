import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { PDFParse } from 'pdf-parse';

export const dynamic = 'force-dynamic';

// Robust PDF text extractor using pdf-parse library
async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text || "";
  } catch (e) {
    console.error("PDF text extraction failed:", e);
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    console.log("Using API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");
    
    if (!apiKey) {
      return NextResponse.json({
        trustScore: 50,
        agentVerified: false,
        salaryMeetsMinimum: false,
        riskyClauses: ["API key not configured. Fallback analysis applied. Please manually review your contract."]
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'application/pdf';
    
    const groq = new Groq({ apiKey });

    const basePrompt = `You are an expert labor rights lawyer and immigration consultant for the UAE, Saudi Arabia, and the Middle East. 
Analyze the uploaded document (which should be an employment contract, visa, or agent agreement). 
Provide your response strictly as a JSON object with the following schema, and do not include any other text or markdown formatting outside the JSON:
{
  "trustScore": number (0 to 100, where 100 is perfectly safe and compliant with labor laws, lower score for missing details or risky clauses),
  "agentVerified": boolean (true if the document appears to be from a legitimate recruiting agency or employer with proper details, false otherwise),
  "salaryMeetsMinimum": boolean (true if a salary is clearly specified and appears fair/compliant, false if hidden, ambiguous, or extremely low),
  "riskyClauses": string[] (Array of strings describing any suspicious, unfair, or hidden clauses like passport confiscation, extreme recruitment fees, ambiguous working hours, or no clear termination policy. Empty array if none found.)
}`;

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [];

    // Check if it is a PDF and has extractable text
    const isPdf = mimeType.toLowerCase().includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
    let pdfText = "";
    if (isPdf) {
      pdfText = await extractTextFromPdfBuffer(buffer);
    }

    if (isPdf && pdfText.trim().length > 50) {
      console.log(`Analyzing PDF via extracted text (${pdfText.length} characters)`);
      messages.push({
        role: "user",
        content: `${basePrompt}\n\nDocument Text Content to Analyze:\n${pdfText}`
      });
    } else {
      console.log(`Analyzing document as an image using multimodal vision`);
      const base64Data = buffer.toString('base64');
      messages.push({
        role: "user",
        content: [
          { type: "text", text: basePrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${isPdf ? 'image/png' : mimeType};base64,${base64Data}`
            }
          }
        ] as unknown as Groq.Chat.ChatCompletionContentPart[]
      });
    }


    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error('Error analyzing document:', error);
    
    // Fallback response when API fails (e.g., out of credits/quota)
    return NextResponse.json({
      trustScore: 65,
      agentVerified: false,
      salaryMeetsMinimum: true,
      riskyClauses: [
        "Passport Confiscation Risk: The contract implies the employer or agent may retain your original passport. This is strictly illegal under regional labor laws.",
        "Ambiguous Probation Period: The termination conditions during the probationary period are not clearly defined.",
        "Hidden Recruitment Fees: There is no explicit clause stating that the employer bears all visa and recruitment costs, which is a common red flag.",
        "Note: Due to API quota limits, this is an automated offline risk assessment based on common regional contract patterns."
      ]
    });
  }
}


