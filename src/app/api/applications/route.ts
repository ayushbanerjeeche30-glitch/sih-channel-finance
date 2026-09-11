import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ratelimit } from '@/lib/ratelimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// GET: Used by the /tracker page to look up existing statuses
export async function GET(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { success: false, message: 'Application tracking is not configured.' },
      { status: 503 }
    );
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success: allowed } = await ratelimit.limit(ip);

  if (!allowed) {
    return NextResponse.json(
      { success: false, message: 'Too many attempts. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const appId = searchParams.get('id');
  const phone = searchParams.get('phone');

  if (!appId || !phone) {
    return NextResponse.json(
      { success: false, message: 'Application ID and registered mobile number are both required' },
      { status: 400 }
    );
  }

    console.log('Searching for:', JSON.stringify({ appId: appId.trim(), phone: phone.trim() }));

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('application_id', appId.trim())
    .eq('applicant_phone', phone.trim())
    .single();

  console.log('Supabase result:', JSON.stringify({ data, error }));

  if (error || !data) {
    // Same message either way — don't reveal whether the ID or phone was wrong
    return NextResponse.json(
      { success: false, message: 'No matching application found. Please check your Application ID and mobile number.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}

// POST: Used to submit new applications
export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Application submission is not configured.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    if (!body.applicant_phone) {
      return NextResponse.json(
        { success: false, message: 'Mobile number is required' },
        { status: 400 }
      );
    }

       // Longer, harder-to-guess tracking ID — 6 digits instead of 4
    const generatedId = `SS-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const submittedDate = new Date();
    const slaDate = new Date(submittedDate);
    slaDate.setDate(slaDate.getDate() + 14);

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        applicant_name: body.applicant_name,
        applicant_phone: body.applicant_phone,
        application_id: generatedId,
        status: 'Submitted',
        partner_name: body.partner_name,
        submitted_date: submittedDate.toISOString().split('T')[0],
        sla_due_date: slaDate.toISOString().split('T')[0],
        escalation_level: 'Normal'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to submit application';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}