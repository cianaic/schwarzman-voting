'use client';

import { useState } from 'react';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
}

export default function QuestionForm({ onSubmit, disabled }: QuestionFormProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
      setQuestion('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit a Question</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to ask?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none h-24"
          disabled={disabled}
          required
        />
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {question.length}/280 characters
          </span>
          <button
            type="submit"
            disabled={disabled || !question.trim() || question.length > 280}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit Question
          </button>
        </div>
      </form>
    </div>
  );
}