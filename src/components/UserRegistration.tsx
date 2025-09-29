'use client';

import { useState } from 'react';
import { User } from '@/types';

interface UserRegistrationProps {
  onRegister: (user: User) => void;
  sessionId: string;
}

export default function UserRegistration({ onRegister, sessionId }: UserRegistrationProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onRegister({ name: name.trim(), sessionId });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome to Schwarzman Scholars Q&A
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please enter your name to participate in the session
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
            autoFocus
            required
          />
          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
}