import { ArrowRight, Sparkles, Rocket, Zap, Target, Flame, Gem } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageContext";

interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  const { t } = useLanguage();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#040725] via-[#051040] to-[#040725] min-h-screen flex items-center">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#BBFF2C]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-[#7B93FF]/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Floating dots */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#BBFF2C] rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-32 w-1 h-1 bg-[#7B93FF] rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#FFC6F2] rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#BBFF2C] rounded-full animate-ping"></div>
        
        {/* Cosmic Orbital System - Background Layer */}
        <div className="absolute top-1/2 left-1/2 w-[1400px] h-[1100px] -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="relative w-full h-full">
            {/* Main Rocket - Background */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6"
              style={{
                animation: 'orbit 25s linear infinite',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="relative">
                <Rocket className="w-12 h-12 text-[#BBFF2C] opacity-60 transform rotate-90 drop-shadow-sm" />
                {/* Rocket trail */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-l from-[#BBFF2C]/40 to-transparent rounded-full"></div>
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-l from-[#BBFF2C]/25 to-transparent rounded-full"></div>
              </div>
            </div>
            
            {/* Orbital Planets - Multiple Layers */}
            {/* Large Blue Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"
              style={{
                animation: 'planet1 30s linear infinite',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-3 h-3 bg-[#7B93FF] rounded-full opacity-40 animate-pulse"></div>
            </div>
            
            {/* Medium Pink Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
              style={{
                animation: 'planet2 35s linear infinite reverse',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-2 h-2 bg-[#FFC6F2] rounded-full opacity-50 animate-pulse"></div>
            </div>
            
            {/* Small Red Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
              style={{
                animation: 'planet3 40s linear infinite',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-2.5 h-2.5 bg-[#FC2D00] rounded-full opacity-30 animate-pulse"></div>
            </div>
            
            {/* Additional Planets */}
            {/* Tiny Purple Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
              style={{
                animation: 'planet4 45s linear infinite reverse',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-1.5 h-1.5 bg-[#51508E] rounded-full opacity-35 animate-pulse"></div>
            </div>
            
            {/* Medium Green Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
              style={{
                animation: 'planet5 50s linear infinite',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-2.5 h-2.5 bg-[#BBFF2C] rounded-full opacity-25 animate-pulse"></div>
            </div>
            
            {/* Small Lavender Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
              style={{
                animation: 'planet6 55s linear infinite reverse',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-1.5 h-1.5 bg-[#D2D0F7] rounded-full opacity-45 animate-pulse"></div>
            </div>
            
            {/* Tiny Orange Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5"
              style={{
                animation: 'planet7 28s linear infinite',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-1 h-1 bg-[#FC2D00] rounded-full opacity-40 animate-pulse"></div>
            </div>
            
            {/* Medium Blue-Purple Planet */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1"
              style={{
                animation: 'planet8 38s linear infinite reverse',
                transformOrigin: '50% 550px'
              }}
            >
              <div className="w-2 h-2 bg-[#7B93FF] rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(187, 255, 44, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(187, 255, 44, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
      </div>



      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 z-10">
        {/* Centered Content */}
        <div className="text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#BBFF2C]/10 border border-[#BBFF2C]/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#BBFF2C] mr-2" />
            <span className="text-sm text-[#BBFF2C]">AI-Powered Business Solutions</span>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tight font-black uppercase">
              <span className="block">Automate</span>
              <span className="block">The Future</span>
              <span className="block text-[#BBFF2C]">Today</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0 group px-8 py-4 text-lg h-auto rounded-2xl shadow-2xl shadow-[#BBFF2C]/20"
              onClick={onOpenModal}
            >
              {t('hero.cta')}
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Startup Values */}
          <div className="pt-16">
            <p className="text-sm text-gray-400 mb-8">Built by innovators, for innovators</p>
            <div className="flex justify-center items-center space-x-8 md:space-x-16">
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-[#BBFF2C]/10">
                  <Rocket className="w-6 h-6 text-[#BBFF2C]" />
                </div>
                <span className="text-xs text-gray-400">{t('hero.feature-1')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-[#7B93FF]/10">
                  <Zap className="w-6 h-6 text-[#7B93FF]" />
                </div>
                <span className="text-xs text-gray-400">{t('hero.feature-2')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-[#FFC6F2]/10">
                  <Target className="w-6 h-6 text-[#FFC6F2]" />
                </div>
                <span className="text-xs text-gray-400">{t('hero.feature-3')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-[#FC2D00]/10">
                  <Flame className="w-6 h-6 text-[#FC2D00]" />
                </div>
                <span className="text-xs text-gray-400">{t('hero.feature-4')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-2 p-2 rounded-full bg-[#BBFF2C]/10">
                  <Gem className="w-6 h-6 text-[#BBFF2C]" />
                </div>
                <span className="text-xs text-gray-400">{t('hero.feature-5')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#040725] to-transparent"></div>
    </section>
  );
}