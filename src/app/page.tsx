'use client';

import { useState, useEffect, useRef } from 'react';
import { Session, Question, User } from '@/types';
import { api } from '@/lib/api';
import UserRegistration from '@/components/UserRegistration';
import SessionManager from '@/components/SessionManager';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';

export default function Home() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Load questions when session or user changes
  const loadQuestions = async (sessionId: string) => {
    try {
      const sessionQuestions = await api.getQuestions(sessionId);
      setQuestions(sessionQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  };

  // Set up polling for real-time updates
  useEffect(() => {
    if (currentSession && currentUser) {
      loadQuestions(currentSession.id);

      // Poll for updates every 5 seconds
      pollIntervalRef.current = setInterval(() => {
        loadQuestions(currentSession.id);
      }, 5000);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }
  }, [currentSession, currentUser]);

  const handleUserRegistration = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setShowRegistration(false);
  };

  const handleSessionChange = (session: Session | null) => {
    setCurrentSession(session);
    if (session) {
      if (!currentUser || currentUser.sessionId !== session.id) {
        setShowRegistration(true);
      }
    } else {
      setQuestions([]);
    }
  };

  const handleQuestionSubmit = async (questionText: string) => {
    if (currentSession && currentUser && !loading) {
      setLoading(true);
      try {
        await api.createQuestion(currentSession.id, questionText, currentUser.name);
        await loadQuestions(currentSession.id);
      } catch (error) {
        console.error('Failed to submit question:', error);
        alert('Failed to submit question. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpvote = async (questionId: string) => {
    if (currentUser && currentSession && !loading) {
      setLoading(true);
      try {
        await api.upvoteQuestion(currentSession.id, questionId, currentUser.name);
        await loadQuestions(currentSession.id);
      } catch (error) {
        console.error('Failed to upvote question:', error);
        // Don't show alert for upvote errors as they might be expected (already voted)
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
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
              disabled={!currentSession || !currentUser || loading}
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
