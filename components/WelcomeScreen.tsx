// FIX: Implement the WelcomeScreen component.
import React from 'react';
import LanguageSelector from './LanguageSelector';
import { Language } from '../types';
import { STRINGS } from '../constants';

interface WelcomeScreenProps {
  onLanguageSelect: (lang: Language) => void;
  language: Language;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLanguageSelect, language }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-stone-200 max-w-2xl w-full">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-amber-800 mb-4">{STRINGS[language].welcomeTitle}</h1>
        <p className="text-xl text-stone-600 mb-8">{STRINGS[language].welcomeSubtitle}</p>
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-stone-700 mb-4">{STRINGS['it'].selectLanguage} / {STRINGS['en'].selectLanguage}</h2>
            <LanguageSelector onLanguageSelect={onLanguageSelect} currentLanguage={language} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
