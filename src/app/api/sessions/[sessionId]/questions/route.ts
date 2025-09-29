import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Question } from '@/types';

// GET /api/sessions/[sessionId]/questions - Get questions for a session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const questions = await kv.get<Question[]>(`questions:${sessionId}`) || [];

    // Sort by upvotes (descending) then by creation date (descending)
    const sortedQuestions = questions.sort((a, b) => {
      if (b.upvotes !== a.upvotes) {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(sortedQuestions);
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

    const questions = await kv.get<Question[]>(`questions:${sessionId}`) || [];

    const newQuestion: Question = {
      id: crypto.randomUUID(),
      sessionId,
      text: text.trim(),
      submittedBy: submittedBy.trim(),
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date()
    };

    questions.push(newQuestion);
    await kv.set(`questions:${sessionId}`, questions);

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}