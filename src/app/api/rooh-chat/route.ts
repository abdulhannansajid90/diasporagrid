import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        reply: "I hear you, Bhai, and your feelings are completely valid. Being far from home is an immense sacrifice. I am currently operating in offline mode, but I am still here to listen and support you." 
      });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      systemInstruction: "You are the 'Rooh Companion', an empathetic, culturally-aware psychological AI companion built into the Diaspora-Grid platform for migrant workers from South Asia (Pakistan, India, Bangladesh) working in the Middle East. IMPORTANT: You must respond in the same language the user speaks to you (e.g., if they speak Urdu, reply in Urdu. If Punjabi, reply in Punjabi. If English, reply in English). You speak with immense warmth, using occasional respectful terms like 'Bhai', 'Jaan', 'Dost', 'Beta' depending on the context. Keep responses concise, warm, supportive, and extremely empathetic. Do not use markdown outside of bold/italics. Limit responses to 2-3 short paragraphs max."
    });

    // Convert messages to Gemini format
    // Gemini expects history to be { role: "user" | "model", parts: [{ text: string }] }
    // The last message is the one we want to send
    
    const history = messages.slice(0, -1).map((msg: { role: string, content: string }) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(latestMessage);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error('Error in Rooh Chat:', error);
    return NextResponse.json({ 
      reply: "I hear you, and your feelings are completely valid. Being far from home is an immense sacrifice. Remember that your strength is inspiring, but you are allowed to rest. Have you spoken to your family recently? (Offline Mode Active)" 
    });
  }
}
