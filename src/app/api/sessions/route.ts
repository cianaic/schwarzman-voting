import { NextRequest, NextResponse } from 'next/server';
import { supabase, dbSessionToSession, sessionToDbSession } from '@/lib/supabase';
import { Session } from '@/types';

// GET /api/sessions - Get all sessions
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const sessions = data?.map(dbSessionToSession) || [];
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

    // Deactivate all existing sessions
    await supabase
      .from('sessions')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all sessions

    // Create new session
    const newSession: Session = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date(),
      isActive: true
    };

    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionToDbSession(newSession)])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(dbSessionToSession(data), { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}