import { NextRequest, NextResponse } from 'next/server';
import { supabase, dbQuestionToQuestion, questionToDbQuestion } from '@/lib/supabase';
import { Question } from '@/types';

// GET /api/sessions/[sessionId]/questions - Get questions for a session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('session_id', sessionId)
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const questions = data?.map(dbQuestionToQuestion) || [];
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

// POST /api/sessions/[sessionId]/questions - Create a new question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { text, submittedBy } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
    }

    if (!submittedBy || submittedBy.trim().length === 0) {
      return NextResponse.json({ error: 'Submitter name is required' }, { status: 400 });
    }

    if (text.length > 280) {
      return NextResponse.json({ error: 'Question must be 280 characters or less' }, { status: 400 });
    }

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      sessionId,
      text: text.trim(),
      submittedBy: submittedBy.trim(),
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date()
    };

    const { data, error } = await supabase
      .from('questions')
      .insert([questionToDbQuestion(newQuestion)])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(dbQuestionToQuestion(data), { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}