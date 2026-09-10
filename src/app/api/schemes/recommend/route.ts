import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { geminiRatelimit } from '@/lib/ratelimit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { success: allowed } = await geminiRatelimit.limit(ip);

    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const { income, cost, purpose, state } = await request.json();

    const prompt = `Applicant Details: Annual Income ₹${income}, Project Cost ₹${cost}, Purpose: ${purpose}, State: ${state}.

Recommend the single best matching NSFDC or government scheme for this SC beneficiary based on their inputs.

Respond with ONLY a valid JSON object. No markdown. No code fences. No explanation before or after. Just the raw JSON object, starting with { and ending with }, in exactly this shape:
{"schemeName": "string", "maxLoanAmount": "string like Rs 15,00,000", "interestRate": "string like 5% p.a.", "incomeThreshold": "string describing the income ceiling", "reasoning": "1-2 sentences citing the applicant's actual income of Rs ${income} and cost of Rs ${cost} against the scheme's real thresholds", "eligible": true}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const rawText = response.text || '';
    console.log('Gemini raw response:', rawText); // temporary — check terminal to see exactly what's coming back

    // Extract just the {...} JSON block, ignoring any stray text before/after
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return a parseable JSON object');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, recommendation: parsed });
  } catch (error: any) {
    console.error('Scheme recommend error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}