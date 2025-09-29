import { createClient } from '@supabase/supabase-js';
import { Session, Question } from '@/types';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseSession {
  id: string;
  name: string;
  created_at: string;
  is_active: boolean;
}

export interface DatabaseQuestion {
  id: string;
  session_id: string;
  text: string;
  submitted_by: string;
  upvotes: number;
  upvoted_by: string[];
  created_at: string;
}

// Type conversion helpers
export function dbSessionToSession(dbSession: DatabaseSession): Session {
  return {
    id: dbSession.id,
    name: dbSession.name,
    createdAt: new Date(dbSession.created_at),
    isActive: dbSession.is_active,
  };
}

export function sessionToDbSession(session: Session): Partial<DatabaseSession> {
  return {
    id: session.id,
    name: session.name,
    created_at: session.createdAt.toISOString(),
    is_active: session.isActive,
  };
}

export function dbQuestionToQuestion(dbQuestion: DatabaseQuestion): Question {
  return {
    id: dbQuestion.id,
    sessionId: dbQuestion.session_id,
    text: dbQuestion.text,
    submittedBy: dbQuestion.submitted_by,
    upvotes: dbQuestion.upvotes,
    upvotedBy: dbQuestion.upvoted_by,
    createdAt: new Date(dbQuestion.created_at),
  };
}

export function questionToDbQuestion(question: Question): Partial<DatabaseQuestion> {
  return {
    id: question.id,
    session_id: question.sessionId,
    text: question.text,
    submitted_by: question.submittedBy,
    upvotes: question.upvotes,
    upvoted_by: question.upvotedBy,
    created_at: question.createdAt.toISOString(),
  };
}