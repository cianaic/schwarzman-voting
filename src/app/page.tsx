'use client';

import { useState, useEffect } from 'react';
import { Session, Question, User } from '@/types';
import { storage } from '@/lib/storage';
import UserRegistration from '@/components/UserRegistration';
import SessionManager from '@/components/SessionManager';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';

export default function Home() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);

    const session = storage.getActiveSession();
    if (session) {
      setCurrentSession(session);
      if (user && user.sessionId !== session.id) {
        setShowRegistration(true);
      } else if (!user) {
        setShowRegistration(true);
      } else {
        setQuestions(storage.getQuestions(session.id));
      }
    }
  }, []);

  const handleUserRegistration = (user: User) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
    setShowRegistration(false);
    if (currentSession) {
      setQuestions(storage.getQuestions(currentSession.id));
    }
  };

  const handleSessionChange = (session: Session | null) => {
    setCurrentSession(session);
    if (session) {
      const user = storage.getCurrentUser();
      if (!user || user.sessionId !== session.id) {
        setShowRegistration(true);
      } else {
        setQuestions(storage.getQuestions(session.id));
      }
    } else {
      setQuestions([]);
    }
  };

  const handleQuestionSubmit = (questionText: string) => {
    if (currentSession && currentUser) {
      storage.createQuestion(currentSession.id, questionText, currentUser.name);
      setQuestions(storage.getQuestions(currentSession.id));
    }
  };

  const handleUpvote = (questionId: string) => {
    if (currentUser && currentSession) {
      const success = storage.upvoteQuestion(questionId, currentUser.name);
      if (success) {
        setQuestions(storage.getQuestions(currentSession.id));
      }
    }
  };

  const handleLogout = () => {
    storage.clearCurrentUser();
    setCurrentUser(null);
    setShowRegistration(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showRegistration && currentSession && (
        <UserRegistration
          onRegister={handleUserRegistration}
          sessionId={currentSession.id}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Schwarzman Scholars Q&A
          </h1>
          <p className="text-gray-600">
            Submit questions and vote on what you&apos;d like to hear discussed
          </p>
          {currentUser && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-purple-600">{currentUser.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Switch User
              </button>
            </div>
          )}
        </header>

        <SessionManager onSessionChange={handleSessionChange} />

        {currentSession && currentUser && (
          <>
            <QuestionForm
              onSubmit={handleQuestionSubmit}
              disabled={!currentSession || !currentUser}
            />

            <QuestionList
              questions={questions}
              currentUser={currentUser}
              onUpvote={handleUpvote}
            />
          </>
        )}

        {currentSession && !currentUser && (
          <div className="text-center py-8">
            <p className="text-gray-600">Please register to participate in the session.</p>
          </div>
        )}

        {!currentSession && (
          <div className="text-center py-8">
            <p className="text-gray-600">Create or select a session to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
