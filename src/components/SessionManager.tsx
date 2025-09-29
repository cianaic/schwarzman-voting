'use client';

import { useState, useEffect } from 'react';
import { Session } from '@/types';
import { api } from '@/lib/api';

interface SessionManagerProps {
  onSessionChange: (session: Session | null) => void;
}

export default function SessionManager({ onSessionChange }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSessions = async () => {
    try {
      const allSessions = await api.getSessions();
      const active = allSessions.find(s => s.isActive) || null;
      setSessions(allSessions);
      setActiveSession(active);
      onSessionChange(active);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSessionName.trim() && !loading) {
      setLoading(true);
      try {
        await api.createSession(newSessionName.trim());
        await loadSessions();
        setNewSessionName('');
        setIsCreating(false);
      } catch (error) {
        console.error('Failed to create session:', error);
        alert('Failed to create session. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSessionSelect = async (sessionId: string) => {
    if (loading) return;
    setLoading(true);
    try {
      await api.activateSession(sessionId);
      await loadSessions();
    } catch (error) {
      console.error('Failed to activate session:', error);
      alert('Failed to activate session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Session Management</h2>

      {activeSession ? (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-gray-800">Active Session:</span>
            <span className="text-purple-600 font-semibold">{activeSession.name}</span>
          </div>
          <p className="text-sm text-gray-600">
            Created {new Date(activeSession.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-600 mb-4">No active session</p>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsCreating(true)}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'New Session'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateSession} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Session name (e.g., 'Leadership Talk - Prof. Smith')"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              autoFocus
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {sessions.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Previous Sessions:</h3>
          <div className="space-y-2">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  session.isActive
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleSessionSelect(session.id)}
              >
                <div className="font-medium text-gray-800">{session.name}</div>
                <div className="text-sm text-gray-600">
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}