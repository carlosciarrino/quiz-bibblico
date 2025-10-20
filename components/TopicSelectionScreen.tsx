import React from 'react';
import { Topic, Language, Difficulty } from '../types';
import { STRINGS, DIFFICULTY_LEVELS, getDifficultyName } from '../constants';

interface TopicSelectionScreenProps {
  topics: Topic[];
  onTopicSelect: (topic: Topic) => void;
  language: Language;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const TopicSelectionScreen: React.FC<TopicSelectionScreenProps> = ({ topics, onTopicSelect, language, difficulty, onDifficultyChange }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-4xl font-serif font-bold text-amber-800 mb-8">{STRINGS[language].selectTopic}</h2>
      
      <div className="mb-10 w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-stone-700 text-center mb-4">{STRINGS[language].selectDifficulty}</h3>
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4">
          {DIFFICULTY_LEVELS.map(level => (
            <button
              key={level}
              onClick={() => onDifficultyChange(level)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 border-2 text-lg ${
                difficulty === level
                  ? 'bg-amber-600 text-white border-amber-700 shadow-md'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {getDifficultyName(level, language)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic)}
            className="group bg-white p-6 rounded-xl shadow-lg border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center aspect-square"
          >
            <div className="mb-4 text-amber-700 transition-transform duration-300 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14">
                <path strokeLinecap="round" strokeLinejoin="round" d={topic.icon} />
              </svg>
            </div>
            <span className="text-lg font-semibold text-stone-700 text-center">{topic.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelectionScreen;