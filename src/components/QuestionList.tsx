'use client';

import { Question, User } from '@/types';
import { ChevronUp } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  currentUser: User | null;
  onUpvote: (questionId: string) => void;
}

export default function QuestionList({ questions, currentUser, onUpvote }: QuestionListProps) {
  const hasUserUpvoted = (question: Question): boolean => {
    return currentUser ? question.upvotedBy.includes(currentUser.name) : false;
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600">No questions yet. Be the first to ask something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Questions ({questions.length})
      </h2>
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex gap-4">
            <button
              onClick={() => onUpvote(question.id)}
              disabled={!currentUser || hasUserUpvoted(question)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors ${
                hasUserUpvoted(question)
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              } disabled:cursor-not-allowed`}
            >
              <ChevronUp className="w-5 h-5" />
              <span className="text-sm font-semibold">{question.upvotes}</span>
            </button>

            <div className="flex-1">
              <p className="text-gray-800 text-lg mb-3">{question.text}</p>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Asked by {question.submittedBy}</span>
                <span>{new Date(question.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}