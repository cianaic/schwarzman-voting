import { Session, Question } from '@/types';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(error.error || 'Request failed', response.status);
  }

  return response.json();
}

export const api = {
  // Session management
  async getSessions(): Promise<Session[]> {
    return fetchApi<Session[]>('/api/sessions');
  },

  async createSession(name: string): Promise<Session> {
    return fetchApi<Session>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async activateSession(sessionId: string): Promise<Session> {
    return fetchApi<Session>(`/api/sessions/${sessionId}/activate`, {
      method: 'PUT',
    });
  },

  // Question management
  async getQuestions(sessionId: string): Promise<Question[]> {
    return fetchApi<Question[]>(`/api/sessions/${sessionId}/questions`);
  },

  async createQuestion(sessionId: string, text: string, submittedBy: string): Promise<Question> {
    return fetchApi<Question>(`/api/sessions/${sessionId}/questions`, {
      method: 'POST',
      body: JSON.stringify({ text, submittedBy }),
    });
  },

  async upvoteQuestion(sessionId: string, questionId: string, userName: string): Promise<Question> {
    return fetchApi<Question>(`/api/sessions/${sessionId}/questions/${questionId}/upvote`, {
      method: 'POST',
      body: JSON.stringify({ userName }),
    });
  },
};