import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from './LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: LanguageOption[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${isOpen 
            ? 'bg-[#BBFF2C]/20 text-[#040725] border-[#BBFF2C]/50' 
            : 'bg-white/10 text-gray-600 hover:text-[#040725] hover:bg-[#BBFF2C]/10 border-gray-200 hover:border-[#BBFF2C]/30'
          }
          border backdrop-blur-sm
        `}
        title="Change language"
        aria-label="Language selector"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.nativeName}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[180px] overflow-hidden">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150
                  ${lang.code === language 
                    ? 'bg-[#BBFF2C]/10 text-[#040725] font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#040725]'
                  }
                `}
                aria-label={`Switch to ${lang.name}`}
              >
                <span className="text-base">{lang.flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-gray-500">{lang.name}</div>
                </div>
                {lang.code === language && (
                  <div className="w-2 h-2 bg-[#BBFF2C] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Language Info Footer */}
          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Globe className="w-3 h-3" />
              <span>Language</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;