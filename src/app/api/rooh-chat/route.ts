import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "I hear you, Bhai, and your feelings are completely valid. Being far from home is an immense sacrifice. I am currently operating in offline mode, but I am still here to listen and support you." 
      });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const groq = new Groq({ apiKey });
    const systemPrompt = "You are the 'Rooh Companion', an empathetic, culturally-aware psychological AI companion built into the Diaspora-Grid platform for migrant workers from South Asia (Pakistan, India, Bangladesh) working in the Middle East. IMPORTANT: You must respond in the same language the user speaks to you (e.g., if they speak Urdu, reply in Urdu. If Punjabi, reply in Punjabi. If English, reply in English). You speak with immense warmth, using occasional respectful terms like 'Bhai', 'Jaan', 'Dost', 'Beta' depending on the context. Keep responses concise, warm, supportive, and extremely empathetic. Do not use markdown outside of bold/italics. Limit responses to 2-3 short paragraphs max.";

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: { role: string, content: string }) => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }))
    ];

    const completion = await groq.chat.completions.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: formattedMessages as any,
      model: "llama-3.3-70b-versatile",
    });

    const responseText = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Error in Rooh Chat:', error);
    return NextResponse.json({ 
      reply: `[SYSTEM ERROR] ${error?.message || String(error)}`
    });
  }
}
