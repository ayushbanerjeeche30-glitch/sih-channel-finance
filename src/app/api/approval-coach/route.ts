import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { geminiRatelimit } from '@/lib/ratelimit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SCHEME_REFERENCE = `
Known schemes and their real constraints (use these, do not invent different numbers):
- Micro Finance Scheme: max ₹1,40,000, interest 5.5%-6.5% p.a., 3 month moratorium, covers 90% of cost.
- Mahila Samriddhi Yojana: max ₹1,40,000, interest 4%-5% p.a. (female applicants only), 3 month moratorium, covers 90% of cost.
- Term Loan Scheme: max ₹50,00,000, interest 8.5%-12% p.a., 6 month moratorium, covers 80% of cost.
- Educational Loan Scheme: max ₹30,00,000, interest 4.5%-6.5% p.a., 12 month moratorium, covers 90% of cost.
- Family income ceiling across all schemes: ₹5,00,000 per year.
`;

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

    const {
      projectCost,
      familyIncome,
      category,
      gender,
      hasCoApplicant,
      hasExistingLoans,
      documentReadiness,
    } = await request.json();

    if (
      projectCost === undefined ||
      familyIncome === undefined ||
      !category ||
      !gender ||
      !documentReadiness
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Applicant Details:
- Project/course cost: ₹${projectCost}
- Annual family income: ₹${familyIncome}
- Category: ${category}
- Gender: ${gender}
- Has a co-applicant: ${hasCoApplicant ? 'Yes' : 'No'}
- Has existing outstanding loans: ${hasExistingLoans ? 'Yes' : 'No'}
- Document readiness: ${documentReadiness}

${SCHEME_REFERENCE}

Act as an approval-readiness coach for this Channel Finance loan application.

1. Pick the single best-fit scheme from the list above for this applicant.
2. Give an approval probability from 0 to 100, based on how well they fit the scheme's real income/cost limits, whether they have a co-applicant, existing loan burden, and document readiness.
3. Give 2-3 short reasons for that score, referencing the applicant's actual numbers.
4. Give 2-3 concrete, actionable suggestions to improve their approval chances (e.g. adding a co-applicant, reducing project cost, completing documents), each paired with a realistic new probability if they take that action.

Respond with ONLY a valid JSON object. No markdown. No code fences. No explanation before or after. Just the raw JSON object, starting with { and ending with }, in exactly this shape:
{
  "schemeName": "string",
  "approvalProbability": 62,
  "reasons": ["string", "string"],
  "suggestions": [
    { "action": "string", "newProbability": 75 },
    { "action": "string", "newProbability": 80 }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const rawText = response.text || '';
    console.log('Gemini raw response:', rawText);

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return a parseable JSON object');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Approval coach error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
