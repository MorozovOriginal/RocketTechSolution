import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Heart,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import JourneyChart from "./JourneyChart";
import { useLanguage } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedLogo from "./AnimatedLogo";
import TypingAnimation from "./TypingAnimation";

interface BrandPlatformProps {
  onClose: () => void;
  onOpenModal: () => void;
}

export default function BrandPlatform({ onClose, onOpenModal }: BrandPlatformProps) {
  const { t } = useLanguage();
  const brandValues = [
    {
      icon: TrendingUp,
      title: t('brand.platform.values.acceleration.title'),
      description: t('brand.platform.values.acceleration.description'),
      color: "bg-[#BBFF2C]",
      textColor: "text-[#040725]"
    },
    {
      icon: Zap,
      title: t('brand.platform.values.precision.title'),
      description: t('brand.platform.values.precision.description'),
      color: "bg-[#7B93FF]",
      textColor: "text-white"
    },
    {
      icon: Clock,
      title: t('brand.platform.values.innovation.title'),
      description: t('brand.platform.values.innovation.description'),
      color: "bg-[#FFC6F2]",
      textColor: "text-[#040725]"
    },
    {
      icon: Heart,
      title: t('brand.platform.values.partnership.title'),
      description: t('brand.platform.values.partnership.description'),
      color: "bg-[#FC2D00]",
      textColor: "text-white"
    }
  ];





  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Animated Logo + Page Title */}
            <div className="flex items-center space-x-2">
              <AnimatedLogo onClick={onClose} />
              <div className="text-[#040725]">
                <TypingAnimation 
                  texts={[t('brand.platform.header.title'), "Rocket Tech Solution"]} 
                  speed={100}
                  pauseDuration={3000}
                  className="min-w-[200px] text-xl font-bold"
                />
              </div>
            </div>
            
            {/* Right - Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#040725] via-[#051040] to-[#040725] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#BBFF2C] rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-[#7B93FF] rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-[#FFC6F2] rounded-full animate-ping"></div>
          <div className="absolute top-20 left-1/3 w-1 h-1 bg-[#FC2D00] rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-1/5 w-2 h-2 bg-[#BBFF2C] rounded-full animate-ping"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#BBFF2C]/10 border border-[#BBFF2C]/20 mb-8">
              <Sparkles className="w-5 h-5 text-[#BBFF2C] mr-2" />
              <span className="text-[#BBFF2C] font-medium">{t('brand.platform.hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8">
              {t('brand.platform.hero.title.line1')}
              <span className="block text-[#BBFF2C]">{t('brand.platform.hero.title.line2')}</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {t('brand.platform.hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#040725] mb-6">
              {t('brand.platform.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('brand.platform.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandValues.map((value, index) => (
              <div key={index} className="group text-center">
                <div className={`${value.color} ${value.textColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[#040725] mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey - Interactive Chart */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#040725] mb-6">
            {t('brand.journey.title') || 'Наш Путь'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('brand.journey.subtitle') || 'От первых оптимизаций до полной цифровой трансформации — график нашего технологического развития.'}
          </p>
        </div>

        <JourneyChart />
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-[#040725]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('brand.platform.cta.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('brand.platform.cta.description')}
            </p>
            <Button 
              onClick={() => {
                onClose();
                setTimeout(() => {
                  onOpenModal();
                }, 300);
              }}
              className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] px-8 py-3 text-lg"
            >
              {t('brand.platform.cta.button')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}