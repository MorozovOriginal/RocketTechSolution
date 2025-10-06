import { X, Users, Mail, Target, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageContext";

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CareersModal({ isOpen, onClose }: CareersModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const opportunities = [
    {
      icon: Target,
      title: t('careers.opportunities.fulltime.title'),
      description: t('careers.opportunities.fulltime.description'),
      color: "from-[#BBFF2C]/20 to-[#7B93FF]/10"
    },
    {
      icon: Zap,
      title: t('careers.opportunities.internship.title'),
      description: t('careers.opportunities.internship.description'),
      color: "from-[#FFC6F2]/20 to-[#BBFF2C]/10"
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#040725] via-[#051040] to-[#040725] px-6 py-6 text-white">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 right-8 w-1 h-1 bg-[#BBFF2C] rounded-full animate-ping"></div>
            <div className="absolute bottom-4 left-8 w-2 h-2 bg-[#7B93FF] rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#FFC6F2] rounded-full animate-ping"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#BBFF2C] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#040725]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t('careers.title')}</h2>
                <p className="text-[#BBFF2C] text-sm">{t('careers.subtitle')}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:text-[#BBFF2C] hover:bg-white/10 p-2 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-bold text-[#040725]">{t('careers.intro.title')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('careers.intro.description')}
            </p>
          </div>

          {/* Opportunities */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#040725] text-center">{t('careers.opportunities.title')}</h4>
            <div className="grid gap-4">
              {opportunities.map((opportunity, index) => (
                <div key={index} className={`bg-gradient-to-r ${opportunity.color} rounded-xl p-4 border border-[#BBFF2C]/20 hover:border-[#BBFF2C]/40 transition-all duration-300 group`}>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <opportunity.icon className="w-5 h-5 text-[#040725]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[#040725] mb-1">{opportunity.title}</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">{opportunity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-[#BBFF2C]/10 via-white/50 to-[#7B93FF]/10 rounded-xl p-6 text-center space-y-4 border border-[#BBFF2C]/20">
            <h4 className="text-lg font-bold text-[#040725]">{t('careers.contact.title')}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('careers.contact.description')}
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-[#BBFF2C]/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-[#BBFF2C]" />
                <span className="font-bold text-[#040725]">{t('careers.contact.email.label')}</span>
              </div>
              <a 
                href="mailto:careers@rts.tech" 
                className="text-[#040725] hover:text-[#51508E] font-medium text-lg transition-colors inline-block"
              >
                careers@rts.tech
              </a>
              <p className="text-xs text-gray-500 mt-2">{t('careers.contact.email.note')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}