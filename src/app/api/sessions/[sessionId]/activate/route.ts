import { NextRequest, NextResponse } from 'next/server';
import { supabase, dbSessionToSession } from '@/lib/supabase';

// PUT /api/sessions/[sessionId]/activate - Set a session as active
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // First, deactivate all sessions
    await supabase
      .from('sessions')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Then activate the target session
    const { data, error } = await supabase
      .from('sessions')
      .update({ is_active: true })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(dbSessionToSession(data));
  } catch (error) {
    console.error('Error activating session:', error);
    return NextResponse.json({ error: 'Failed to activate session' }, { status: 500 });
  }
}