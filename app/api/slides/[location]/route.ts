import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, context: { params: { location: string } }) {
  try {
    const location = context.params.location;

    const body = await req.json();

    const { imageUrl, expiresAt, isHidden } = body;

    if (!imageUrl || !expiresAt || !location) {
      console.error('❌ Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parsedDate = new Date(expiresAt);
    if (isNaN(parsedDate.getTime())) {
      console.error('❌ Invalid expiresAt:', expiresAt);
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const { data, error } = await supabase.from('slides').insert([
      {
        imageUrl,
        expiresAt: parsedDate,
        isHidden: isHidden ?? false,
        location,
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Slide inserted:', data?.[0]);

  return NextResponse.json({ success: true }, { status: 201 });

  } catch (err: any) {
    console.error('❌ Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}


export async function GET(req: NextRequest, { params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;

  if (location !== 'ru' && location !== 'cy') {
    return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('location', location)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
