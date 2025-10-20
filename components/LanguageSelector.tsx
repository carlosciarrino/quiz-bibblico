
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  onLanguageSelect: (lang: Language) => void;
  currentLanguage: Language;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect, currentLanguage }) => {
  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 flex-wrap">
      {languages.map(({ code, name, flag }) => (
        <button
          key={code}
          onClick={() => onLanguageSelect(code)}
          className={`px-3 py-2 my-1 rounded-lg transition-all duration-200 flex items-center space-x-2 border-2 ${
            currentLanguage === code
              ? 'bg-amber-600 text-white border-amber-700 shadow-md'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
          }`}
        >
          <span>{flag}</span>
          <span className="hidden sm:inline">{name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
