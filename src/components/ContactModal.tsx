import { X, Mail, Phone, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageContext";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.modal.email.label'),
      value: "hello@rts.tech",
      href: "mailto:hello@rts.tech",
      color: "from-[#BBFF2C]/20 to-[#7B93FF]/10"
    },
    {
      icon: Phone,
      label: t('contact.modal.phone.label'),
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      color: "from-[#FFC6F2]/20 to-[#BBFF2C]/10"
    }
  ];



  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
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
                <Globe className="w-5 h-5 text-[#040725]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{t('contact.modal.title')}</h2>
                <p className="text-[#BBFF2C] text-sm">{t('contact.modal.subtitle')}</p>
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
            <h3 className="text-lg font-bold text-[#040725]">{t('contact.modal.intro.title')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {t('contact.modal.intro.description')}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-[#040725] text-center">{t('contact.modal.info.title')}</h4>
            <div className="grid gap-4">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className={`bg-gradient-to-r ${contact.color} rounded-xl p-4 border border-[#BBFF2C]/20 hover:border-[#BBFF2C]/40 transition-all duration-300 group block`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <contact.icon className="w-5 h-5 text-[#040725]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[#040725] mb-1">{contact.label}</h5>
                      <p className="text-gray-600 font-medium">{contact.value}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>



          {/* Call to Action */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {t('contact.modal.cta')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}