import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Partner search is not configured.' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const pincode = searchParams.get('pincode');

    let query = supabase.from('channel_partners').select('*');

    if (state) {
      query = query.ilike('state', `%${state}%`);
    }
    if (pincode) {
      query = query.eq('pincode', pincode);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to load partners';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}