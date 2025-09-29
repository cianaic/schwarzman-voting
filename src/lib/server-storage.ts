import { Session, Question } from '@/types';

// Simple in-memory storage for server-side persistence
// This will persist data across API calls during the same deployment
const sessions: Session[] = [];
const questionsData: { [sessionId: string]: Question[] } = {};

export const serverStorage = {
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

  setActiveSession: (sessionId: string): Session | null => {
    sessions.forEach(s => s.isActive = s.id === sessionId);
    return sessions.find(s => s.id === sessionId) || null;
  },

  // Question management
  getQuestions: (sessionId: string): Question[] => {
    const questions = questionsData[sessionId] || [];
    return questions.sort((a, b) => {
      if (b.upvotes !== a.upvotes) {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  createQuestion: (sessionId: string, text: string, submittedBy: string): Question => {
    if (!questionsData[sessionId]) {
      questionsData[sessionId] = [];
    }

    const question: Question = {
      id: crypto.randomUUID(),
      sessionId,
      text,
      submittedBy,
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date()
    };

    questionsData[sessionId].push(question);
    return question;
  },

  upvoteQuestion: (sessionId: string, questionId: string, userName: string): Question | null => {
    const questions = questionsData[sessionId];
    if (!questions) return null;

    const question = questions.find(q => q.id === questionId);
    if (!question || question.upvotedBy.includes(userName)) {
      return null;
    }

    question.upvotes++;
    question.upvotedBy.push(userName);
    return question;
  }
};