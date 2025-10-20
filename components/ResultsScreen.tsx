import React from 'react';
import { Topic, Language } from '../types';
import { STRINGS, QUESTIONS_PER_BLOCK } from '../constants';

interface ResultsScreenProps {
  topic: Topic;
  correctCount: number;
  blockScore: number;
  totalScore: number;
  onPlayAgain: () => void;
  language: Language;
  difficultyChangeMessage: string | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ topic, correctCount, blockScore, totalScore, onPlayAgain, language, difficultyChangeMessage }) => {
  const strings = STRINGS[language];
  const percentage = Math.round((correctCount / QUESTIONS_PER_BLOCK) * 100);

  const getRingColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  return (
    <div className="flex flex-col items-center p-4 text-center">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-stone-200 max-w-2xl w-full">
        <h2 className="text-4xl font-serif font-bold text-amber-800 mb-2">{strings.resultsFor} "{topic.id}"</h2>
        <p className="text-lg text-stone-600 mb-8">
          {correctCount} / {QUESTIONS_PER_BLOCK} {strings.correctAnswers}
        </p>
        
        <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    className="text-stone-200"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                />
                <path
                    className={getRingColor()}
                    strokeDasharray={`${percentage}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-slate-800">{percentage}%</span>
                <span className="text-sm text-stone-500">{strings.successPercentage}</span>
            </div>
        </div>

        <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-4 text-lg mb-8">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-600 text-base font-semibold">{strings.blockScore}</p>
                <p className="text-4xl font-bold text-amber-900 mt-1">{blockScore}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-600 text-base font-semibold">{strings.totalScore}</p>
                <p className="text-4xl font-bold text-amber-900 mt-1">{totalScore}</p>
            </div>
        </div>

        {difficultyChangeMessage && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-center shadow-sm">
                <p className="font-semibold">{difficultyChangeMessage}</p>
            </div>
        )}

        <button
          onClick={onPlayAgain}
          className="bg-amber-700 text-white font-bold py-3 px-12 rounded-full hover:bg-amber-800 transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          {strings.playAgain}
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;