import { NextRequest, NextResponse } from 'next/server';
import { supabase, dbQuestionToQuestion } from '@/lib/supabase';

// POST /api/sessions/[sessionId]/questions/[questionId]/upvote - Upvote a question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const { userName } = await request.json();

    if (!userName || userName.trim().length === 0) {
      return NextResponse.json({ error: 'User name is required' }, { status: 400 });
    }

    // Get the current question
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (fetchError) throw fetchError;
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Check if user has already upvoted
    if (question.upvoted_by.includes(userName.trim())) {
      return NextResponse.json({ error: 'User has already upvoted this question' }, { status: 400 });
    }

    // Update the question with new upvote
    const newUpvotedBy = [...question.upvoted_by, userName.trim()];
    const { data: updatedQuestion, error: updateError } = await supabase
      .from('questions')
      .update({
        upvotes: question.upvotes + 1,
        upvoted_by: newUpvotedBy
      })
      .eq('id', questionId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(dbQuestionToQuestion(updatedQuestion));
  } catch (error) {
    console.error('Error upvoting question:', error);
    return NextResponse.json({ error: 'Failed to upvote question' }, { status: 500 });
  }
}