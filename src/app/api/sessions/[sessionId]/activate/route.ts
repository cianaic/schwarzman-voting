import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Session } from '@/types';

// PUT /api/sessions/[sessionId]/activate - Set a session as active
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const sessions = await kv.get<Session[]>('sessions') || [];

    // Find the session to activate
    const sessionToActivate = sessions.find(s => s.id === sessionId);
    if (!sessionToActivate) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Deactivate all other sessions and activate the target session
    sessions.forEach(session => {
      session.isActive = session.id === sessionId;
    });

    await kv.set('sessions', sessions);

    return NextResponse.json(sessionToActivate);
  } catch (error) {
    console.error('Error activating session:', error);
    return NextResponse.json({ error: 'Failed to activate session' }, { status: 500 });
  }
}