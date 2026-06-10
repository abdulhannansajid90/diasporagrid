import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
// @ts-expect-error: pdf-parse library lacks TypeScript typings
import pdf from 'pdf-parse/lib/pdf-parse.js';

export const dynamic = 'force-dynamic';




// Robust PDF text extractor using pdf-parse library
async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text || "";
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
    } else if (isPdf) {
      console.log(`Scanned PDF uploaded. Returning clean error message.`);
      return NextResponse.json({
        error: "The uploaded PDF appears to be a scanned image and contains no extractable text. Please upload the contract directly as an image (JPG/PNG), or upload a text-based PDF."
      }, { status: 400 });
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
              url: `data:${mimeType};base64,${base64Data}`
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
    console.log("Groq Response Content:", responseText);
    const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    return NextResponse.json(analysis);

  } catch (error: unknown) {
    console.error('Error analyzing document:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: `Analysis failed: ${errorMessage}`
    }, { status: 500 });
  }
}



