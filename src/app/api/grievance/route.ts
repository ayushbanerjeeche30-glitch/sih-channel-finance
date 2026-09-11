import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ratelimit } from '@/lib/ratelimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ success: false, message: 'Not configured' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success: allowed } = await ratelimit.limit(ip);
  if (!allowed) {
    return NextResponse.json({ success: false, message: 'Too many requests. Try again in a minute.' }, { status: 429 });
  }

  const body = await request.json();
  const { application_id, applicant_phone, message } = body;

  if (!application_id || !applicant_phone || !message) {
    return NextResponse.json(
      { success: false, message: 'All fields are required' },
      { status: 400 }
    );
  }

  const { data: app } = await supabase
    .from('applications')
    .select('application_id')
    .eq('application_id', application_id.trim())
    .eq('applicant_phone', applicant_phone.trim())
    .single();

  if (!app) {
    return NextResponse.json(
      { success: false, message: 'No matching application found for that ID and phone number' },
      { status: 404 }
    );
  }

  const { error } = await supabase.from('grievances').insert([
    { application_id, applicant_phone, message, status: 'Open' },
  ]);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  await supabase
    .from('applications')
    .update({ escalation_level: 'Level 2 - Critical Escalated' })
    .eq('application_id', application_id);

  return NextResponse.json({ success: true, message: 'Grievance submitted successfully' });
}