export interface Session {
  id: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Question {
  id: string;
  sessionId: string;
  text: string;
  submittedBy: string;
  upvotes: number;
  upvotedBy: string[];
  createdAt: Date;
}

export interface User {
  name: string;
  sessionId: string;
}