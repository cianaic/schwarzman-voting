import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/server-storage';
import { Session } from '@/types';

// PUT /api/sessions/[sessionId]/activate - Set a session as active
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const sessionToActivate = serverStorage.setActiveSession(sessionId);

    if (!sessionToActivate) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(sessionToActivate);
  } catch (error) {
    console.error('Error activating session:', error);
    return NextResponse.json({ error: 'Failed to activate session' }, { status: 500 });
  }
}