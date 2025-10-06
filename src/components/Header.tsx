import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import SimpleTypingTest from "./SimpleTypingTest";
import LanguageSwitcher from "./LanguageSwitcher";
import StatusNotification from "./StatusNotification";
import { useLanguage } from "./LanguageContext";

interface HeaderProps {
  onOpenModal: () => void;
}

export default function Header({ onOpenModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#BBFF2C] rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-[#040725] font-mono font-black text-xl leading-none">
                &gt;
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>
            <SimpleTypingTest />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-[#040725] hover:text-[#51508E] transition-colors">
              {t('nav.services')}
            </a>
            <a href="#our-solutions" className="text-[#040725] hover:text-[#51508E] transition-colors">
              {t('nav.solutions')}
            </a>
            <a href="#how-we-work" className="text-[#040725] hover:text-[#51508E] transition-colors">
              {t('nav.how-we-work')}
            </a>
            <a href="#about" className="text-[#040725] hover:text-[#51508E] transition-colors">
              {t('nav.about')}
            </a>
            <a href="#contact" className="text-[#040725] hover:text-[#51508E] transition-colors">
              {t('nav.contact')}
            </a>
            
            {/* Status Indicator */}
            <StatusNotification className="hidden lg:flex" />
            
            {/* Language Toggle */}
            <LanguageSwitcher />

            <Button 
              className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0"
              onClick={onOpenModal}
            >
              {t('nav.get-started')}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#040725]" />
            ) : (
              <Menu className="w-6 h-6 text-[#040725]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#services" className="text-[#040725] hover:text-[#51508E] transition-colors">
                {t('nav.services')}
              </a>
              <a href="#our-solutions" className="text-[#040725] hover:text-[#51508E] transition-colors">
                {t('nav.solutions')}
              </a>
              <a href="#how-we-work" className="text-[#040725] hover:text-[#51508E] transition-colors">
                {t('nav.how-we-work')}
              </a>
              <a href="#about" className="text-[#040725] hover:text-[#51508E] transition-colors">
                {t('nav.about')}
              </a>
              <a href="#contact" className="text-[#040725] hover:text-[#51508E] transition-colors">
                {t('nav.contact')}
              </a>
              
              {/* Mobile Language Toggle */}
              <div className="pt-2">
                <LanguageSwitcher />
              </div>

              <Button 
                className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0 w-fit"
                onClick={onOpenModal}
              >
                {t('nav.get-started')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}