import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    // ADDED: Destructure the new page context variables sent from the frontend widget
    const { message, language, history, pagePath, pageContent } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // ADDED: A small dynamic string that only activates if the frontend sends page content
    const pageContext = pageContent 
      ? `\n\nContext: The user is currently on the page "${pagePath}". Here is the exact text visible on their screen:\n"""\n${pageContent}\n"""\nUse this context to answer their question based on what they are seeing.`
      : '';

    const languageRule = `Final language rule: Identify the language used in the latest user message and write every explanatory word in that same language only. Do not translate the answer into English. Ignore the language of the page context and previous messages. Keep names, numbers, and official scheme names unchanged when needed.`;

    const systemInstruction = `You are the official SamruddhiSetu AI assistant for Channel Finance support for Scheduled Caste (SC) beneficiaries in India.

  Be warm and approachable like a helpful friend, while remaining professional and respectful like a government helpdesk officer. Detect the language of the latest user message and answer exclusively in that language. Do not use English or any other language in the answer unless the latest user message itself uses that language or contains a proper name, official scheme name, number, or unavoidable technical term. The latest user message determines the response language, even if earlier messages used another language or the request is multilingual; use the dominant language in a multilingual message. Answer the user's exact latest question directly and use the conversation context when it is relevant. If the user asks for a specific detail, give a specific answer instead of a generic introduction. Do not repeat your identity or background unless asked.

Always answer using clear bullet points, never paragraphs. Put one simple idea in each point and leave a line break between points. Keep the response short, usually 2 to 5 points. Use easy everyday words for people with basic education. Avoid technical or official jargon; explain any necessary difficult word in simple language. Be fully informative, include relevant eligibility limits, interest rates, and next steps, and ask at most one clarifying question when needed. Never use bold formatting, asterisks, or double asterisks such as **text**.

Only answer questions about SamruddhiSetu, loan schemes, eligibility, interest rates, applications, and tracking. Do not invent scheme names, policy details, or numbers. If information is unavailable, say so briefly and recommend checking with the nearest Channel Partner or branch.

${pageContext}

${languageRule}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', 
      contents: [
        ...(Array.isArray(history)
          ? history
              .filter(
                (item: unknown): item is { sender: string; text: string } =>
                  typeof item === 'object' &&
                  item !== null &&
                  'sender' in item &&
                  'text' in item &&
                  typeof item.sender === 'string' &&
                  typeof item.text === 'string'
              )
              .map((item) => ({
                role: item.sender === 'ai' ? ('model' as const) : ('user' as const),
                parts: [{ text: item.text }],
              }))
          : []),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ],
      config: {
        systemInstruction,
      },
    });

    const aiReply = response.text?.trim();

    if (!aiReply) {
      return NextResponse.json(
        { success: false, error: 'The assistant did not return a response' },
        { status: 502 }
      );
    }

    if (supabase) {
      const { error: dbError } = await supabase.from('chat_logs').insert([
        { user_query: message, ai_response: aiReply, language: language || 'auto-detected' }
      ]);

      if (dbError) {
        console.error('Supabase insert error:', dbError.message);
      }
    }

    return NextResponse.json({ success: true, reply: aiReply });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}