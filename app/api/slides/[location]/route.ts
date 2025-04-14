import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

type LocationParams = Promise<{ location: string }>;


export async function POST(
  req: NextRequest,
  { params }: { params: LocationParams }
) {
  const { location } = await params;
  const { imageUrl, expiresAt, isHidden } = await req.json();

  if (!imageUrl || !expiresAt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await supabase.from('slides').insert([
    {
      imageUrl,
      expiresAt: new Date(expiresAt),
      isHidden: isHidden ?? false,
      location,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}


export async function GET(
  req: NextRequest,
  { params }: { params: LocationParams }
) {
  const { location } = await params;

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
