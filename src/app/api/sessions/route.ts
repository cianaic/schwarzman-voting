import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Session } from '@/types';

// GET /api/sessions - Get all sessions
export async function GET() {
  try {
    const sessions = await kv.get<Session[]>('sessions') || [];
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Session name is required' }, { status: 400 });
    }

    // Get existing sessions and deactivate them
    const sessions = await kv.get<Session[]>('sessions') || [];
    sessions.forEach(session => session.isActive = false);

    // Create new session
    const newSession: Session = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date(),
      isActive: true
    };

    sessions.push(newSession);
    await kv.set('sessions', sessions);

    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}