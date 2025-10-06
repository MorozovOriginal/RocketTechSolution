import { Mail, Phone, Globe } from "lucide-react";
import SimpleTypingTest from "./SimpleTypingTest";
import { useLanguage } from "./LanguageContext";

interface FooterProps {
  onOpenCareersModal?: () => void;
  onOpenAllSolutions?: () => void;
  onOpenBrandPlatform?: () => void;
}

export default function Footer({ onOpenCareersModal, onOpenAllSolutions, onOpenBrandPlatform }: FooterProps) {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#040725] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(187, 255, 44, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(187, 255, 44, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#BBFF2C] rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-[#040725] font-mono font-black text-2xl leading-none">
                  &gt;
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  <SimpleTypingTest />
                </div>
                <p className="text-[#BBFF2C] text-sm">{t('footer.tagline')}</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-lg">
              {t('footer.description')}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold mb-6">{t('contact.modal.info.title')}</h4>
            <div className="space-y-4">
              <a
                href="mailto:hello@rts.tech"
                className="flex items-center space-x-3 text-gray-300 hover:text-[#BBFF2C] transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 group-hover:bg-[#BBFF2C]/20 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5 text-[#BBFF2C] group-hover:text-[#BBFF2C]" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t('contact.modal.email.label')}</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">hello@rts.tech</div>
                </div>
              </a>
              
              <a
                href="tel:+15551234567"
                className="flex items-center space-x-3 text-gray-300 hover:text-[#BBFF2C] transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-800 group-hover:bg-[#BBFF2C]/20 rounded-lg flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5 text-[#BBFF2C] group-hover:text-[#BBFF2C]" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t('contact.modal.phone.label')}</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">+1 (555) 123-4567</div>
                </div>
              </a>


            </div>
          </div>

          {/* Company Navigation */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold mb-6">{t('footer.company.title')}</h4>
            <nav className="space-y-4">
              <button 
                onClick={onOpenBrandPlatform}
                className="block text-gray-300 hover:text-[#BBFF2C] transition-colors text-left group"
              >
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {t('footer.company.about')}
                </span>
              </button>
              <button 
                onClick={onOpenCareersModal}
                className="block text-gray-300 hover:text-[#BBFF2C] transition-colors text-left group"
              >
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {t('footer.company.careers')}
                </span>
              </button>
              <button 
                onClick={onOpenAllSolutions}
                className="block text-gray-300 hover:text-[#BBFF2C] transition-colors text-left group"
              >
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {t('footer.company.solutions')}
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              {t('footer.copyright')}
            </div>
            

            
            {/* Creator Credit */}
            <div className="text-xs text-[#BBFF2C] flex items-center space-x-2">
              <span>Created by</span>
              <span className="font-mono">@vehvsa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-2 h-2 bg-[#BBFF2C] rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-1 h-1 bg-[#7B93FF] rounded-full animate-ping"></div>
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#FFC6F2] rounded-full animate-pulse"></div>
    </footer>
  );
}