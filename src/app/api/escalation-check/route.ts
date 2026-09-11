import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ success: false, message: 'Not configured' }, { status: 503 });
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: overdue, error } = await supabase
    .from('applications')
    .select('*')
    .eq('status', 'Under review')
    .lt('sla_due_date', today)
    .eq('escalation_level', 'Normal');

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  if (overdue && overdue.length > 0) {
    const ids = overdue.map((a) => a.application_id);
    await supabase
      .from('applications')
      .update({ escalation_level: 'Level 1 - Delayed' })
      .in('application_id', ids);
  }

  return NextResponse.json({ success: true, flagged: overdue?.length || 0 });
}