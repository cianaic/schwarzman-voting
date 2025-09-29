import { NextRequest, NextResponse } from 'next/server';
import { serverStorage } from '@/lib/server-storage';
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

    const question = serverStorage.upvoteQuestion(sessionId, questionId, userName.trim());

    if (!question) {
      return NextResponse.json({ error: 'Question not found or user has already upvoted' }, { status: 400 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error upvoting question:', error);
    return NextResponse.json({ error: 'Failed to upvote question' }, { status: 500 });
  }
}