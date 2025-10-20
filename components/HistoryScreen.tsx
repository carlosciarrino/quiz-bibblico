import React from 'react';
import { GameResult, Language } from '../types';
import { STRINGS, getDifficultyName } from '../constants';

interface HistoryScreenProps {
  history: GameResult[];
  language: Language;
  onBack: () => void;
  onClearHistory: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, language, onBack, onClearHistory }) => {
  const strings = STRINGS[language];

  const handleClearClick = () => {
    if (window.confirm(strings.confirmClearHistory)) {
      onClearHistory();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 text-center w-full max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-xl border border-stone-200 w-full">
        <h2 className="text-4xl font-serif font-bold text-amber-800 mb-6">{strings.history}</h2>
        
        <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-stone-200 text-stone-700 font-bold py-2 px-6 rounded-full hover:bg-stone-300 transition-colors"
            >
              {strings.backToTopics}
            </button>
            {history.length > 0 && (
                 <button
                   onClick={handleClearClick}
                   className="bg-red-100 text-red-700 font-bold py-2 px-6 rounded-full hover:bg-red-200 transition-colors"
                 >
                   {strings.clearHistory}
                 </button>
            )}
        </div>
        
        {history.length === 0 ? (
          <p className="text-stone-600 text-lg py-12">{strings.noHistory}</p>
        ) : (
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b-2 border-amber-200 bg-amber-50">
                  <tr>
                    <th className="p-3 text-sm font-semibold tracking-wide text-amber-800">{strings.date}</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-amber-800">{strings.topic}</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-amber-800 text-center">{strings.difficulty}</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-amber-800 text-center">{strings.score}</th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-amber-800 text-center">{strings.correctAnswers}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((result, index) => (
                    <tr key={index} className="border-b border-stone-200 last:border-b-0">
                      <td className="p-3 text-stone-700">{new Date(result.date).toLocaleString(language)}</td>
                      <td className="p-3 text-stone-700 font-semibold">{result.topic}</td>
                      <td className="p-3 text-stone-700 text-center">{getDifficultyName(result.difficulty, language)}</td>
                      <td className="p-3 text-stone-800 font-bold text-center">{result.score}</td>
                      <td className="p-3 text-stone-700 text-center">{result.correct} / {result.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;