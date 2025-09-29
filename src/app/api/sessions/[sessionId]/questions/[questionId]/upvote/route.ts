import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Question } from '@/types';

// POST /api/sessions/[sessionId]/questions/[questionId]/upvote - Upvote a question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; questionId: string }> }
) {
  try {
    const { sessionId, questionId } = await params;
    const { userName } = await request.json();

    if (!userName || userName.trim().length === 0) {
      return NextResponse.json({ error: 'User name is required' }, { status: 400 });
    }

    const questions = await kv.get<Question[]>(`questions:${sessionId}`) || [];
    const questionIndex = questions.findIndex(q => q.id === questionId);

    if (questionIndex === -1) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const question = questions[questionIndex];

    // Check if user has already upvoted
    if (question.upvotedBy.includes(userName.trim())) {
      return NextResponse.json({ error: 'User has already upvoted this question' }, { status: 400 });
    }

    // Add upvote
    question.upvotes++;
    question.upvotedBy.push(userName.trim());

    await kv.set(`questions:${sessionId}`, questions);

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error upvoting question:', error);
    return NextResponse.json({ error: 'Failed to upvote question' }, { status: 500 });
  }
}