import { Session, Question, User } from '@/types';

// Simple in-memory storage for demo purposes
const sessions: Session[] = [];
const questions: Question[] = [];
let currentUser: User | null = null;

export const storage = {
  // Session management
  getSessions: (): Session[] => sessions,

  getActiveSession: (): Session | null =>
    sessions.find(s => s.isActive) || null,

  createSession: (name: string): Session => {
    // Deactivate existing sessions
    sessions.forEach(s => s.isActive = false);

    const session: Session = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      isActive: true
    };
    sessions.push(session);
    return session;
  },

  setActiveSession: (sessionId: string): void => {
    sessions.forEach(s => s.isActive = s.id === sessionId);
  },

  // Question management
  getQuestions: (sessionId: string): Question[] =>
    questions
      .filter(q => q.sessionId === sessionId)
      .sort((a, b) => b.upvotes - a.upvotes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  createQuestion: (sessionId: string, text: string, submittedBy: string): Question => {
    const question: Question = {
      id: crypto.randomUUID(),
      sessionId,
      text,
      submittedBy,
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date()
    };
    questions.push(question);
    return question;
  },

  upvoteQuestion: (questionId: string, userName: string): boolean => {
    const question = questions.find(q => q.id === questionId);
    if (!question || question.upvotedBy.includes(userName)) {
      return false;
    }

    question.upvotes++;
    question.upvotedBy.push(userName);
    return true;
  },

  // User management
  getCurrentUser: (): User | null => currentUser,

  setCurrentUser: (user: User): void => {
    currentUser = user;
  },

  clearCurrentUser: (): void => {
    currentUser = null;
  }
};