import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/server-storage';
import { Question } from '@/types';

// GET /api/sessions/[sessionId]/questions - Get questions for a session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const questions = serverStorage.getQuestions(sessionId);
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

    const newQuestion = serverStorage.createQuestion(sessionId, text.trim(), submittedBy.trim());
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}