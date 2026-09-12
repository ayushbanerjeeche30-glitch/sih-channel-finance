import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { geminiRatelimit } from '@/lib/ratelimit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const { success: allowed } = await geminiRatelimit.limit(ip);

    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const body = await request.json();
    let prompt = "";

    const schemaInstructions = `
CRITICAL: Return ONLY a flat JSON object. Do not wrap it in another object.
{
  "extractedIncome": 000000,
  "extractedCost": 000000,
  "extractedState": "State name or null",
  "schemeName": "Name of the government scheme (e.g., Micro Credit Finance)",
  "maxLoanAmount": "₹X,XX,XXX",
  "interestRate": "5% p.a.",
  "incomeThreshold": "₹3,00,000",
  "reasoning": "1-2 sentences explaining why they are eligible or not.",
  "eligible": true or false,
  "alternatives": [
    {
      "schemeName": "Alternative Scheme Name",
      "maxLoanAmount": "₹X,XX,XXX",
      "interestRate": "5% p.a.",
      "incomeThreshold": "₹3,00,000",
      "reasoning": "Why this alternative fits better."
    }
  ]
}
IMPORTANT: If eligible is false, you MUST provide 1-2 items in the alternatives array. If eligible is true, alternatives should be an empty array [].`;

    if (body.voiceTranscript) {
      prompt = `A beneficiary spoke this text: "${body.voiceTranscript}".

Carefully extract these fields from natural, possibly messy speech:
- Annual income (in ₹). Indian speakers often say numbers as words, e.g. "four lakh forty thousand" = 440000, "2 lakh" = 200000, "80 thousand" = 80000, "1.2 crore" = 12000000. Convert these to plain numbers.
- Project/loan cost (in ₹), same number-word rules apply.
- State (e.g., Bihar, Jharkhand, West Bengal).
- Loan purpose.

ONLY use a default if that specific field is genuinely never mentioned anywhere in the sentence:
- Default cost if truly unmentioned: ₹3,00,000
- Default income if truly unmentioned: ₹3,00,000 (this sits exactly at the eligibility threshold — do NOT invent a low number just because parsing is hard; if you are unsure but a number was clearly spoken, use your best-effort numeric conversion of it instead of a default).

Then evaluate the extracted income/cost against real NSFDC scheme thresholds, exactly as strictly as you would for a typed application. Do not make it artificially easier to qualify just because the input came from voice.

If a state was mentioned, make the "schemeName" reflect that state (e.g., "NSFDC Micro Finance - Jharkhand" or "Bihar State Channelizing Agency Scheme").

${schemaInstructions}`;
    } else {
      const { income, cost, purpose, state } = body;
      prompt = `Applicant Details: Income ₹${income}, Cost ₹${cost}, Purpose: ${purpose}, State: ${state}.
Evaluate against NSFDC schemes.
${schemaInstructions}`;
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
      });
    } catch (err) {
      response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
    }

    const rawText = response.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini did not return valid JSON');

    let parsed = JSON.parse(jsonMatch[0]);

    // Defensive Un-nester
    if (parsed.recommendation && typeof parsed.recommendation === 'object') {
      parsed = parsed.recommendation;
    }

    // Robust boolean parsing — handles true/false as booleans OR strings ("true"/"false")
    let eligible: boolean;
    if (typeof parsed.eligible === 'boolean') {
      eligible = parsed.eligible;
    } else if (typeof parsed.eligible === 'string') {
      eligible = parsed.eligible.trim().toLowerCase() === 'true';
    } else {
      eligible = true;
    }

    // Process alternatives to guarantee no empty UI boxes
    let safeAlternatives = [];
    if (Array.isArray(parsed.alternatives) && parsed.alternatives.length > 0) {
      safeAlternatives = parsed.alternatives.map((alt: any) => ({
        schemeName: alt.schemeName || "State-Level Support Scheme",
        maxLoanAmount: alt.maxLoanAmount || "Varies",
        interestRate: alt.interestRate || "Standard Rates",
        incomeThreshold: alt.incomeThreshold || "Subject to state rules",
        reasoning: alt.reasoning || "Consider checking local state-sponsored schemes."
      }));
    } else if (eligible === false) {
      // Force a fallback alternative if AI forgot it but rejected the user
      safeAlternatives = [{
        schemeName: "State SCA Finance Scheme",
        maxLoanAmount: "Up to project cost",
        interestRate: "Varies by state",
        incomeThreshold: "Higher state limits",
        reasoning: "Since your income exceeds the national limits, state-level agencies often have programs with higher family income caps."
      }];
    }

    const finalData = {
      schemeName: parsed.schemeName || "NSFDC Scheme",
      maxLoanAmount: parsed.maxLoanAmount || "₹1,00,000",
      interestRate: parsed.interestRate || "5% p.a.",
      incomeThreshold: parsed.incomeThreshold || "₹3,00,000",
      reasoning: parsed.reasoning || "Based on the details, this is the closest match.",
      eligible,
      alternatives: safeAlternatives,
      // Debug-only fields — safe to remove before final submission, but useful now
      // to see in your browser Network tab whether voice parsing extracted sane numbers.
      _debugExtracted: body.voiceTranscript ? {
        income: parsed.extractedIncome ?? null,
        cost: parsed.extractedCost ?? null,
        state: parsed.extractedState ?? null,
      } : undefined,
    };

    return NextResponse.json({ success: true, recommendation: finalData });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
