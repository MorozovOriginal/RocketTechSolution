import { Ear, PenTool, Wrench, Rocket, Target, Zap, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageContext";

interface HowWeWorkProps {
  onOpenModal: () => void;
}

export default function HowWeWork({ onOpenModal }: HowWeWorkProps) {
  const { t } = useLanguage();
  
  const steps = [
    {
      number: "01",
      icon: Ear,
      titleKey: "howwework.step1.title",
      descriptionKey: "howwework.step1.description"
    },
    {
      number: "02", 
      icon: PenTool,
      titleKey: "howwework.step2.title",
      descriptionKey: "howwework.step2.description"
    },
    {
      number: "03",
      icon: Wrench,
      titleKey: "howwework.step3.title",
      descriptionKey: "howwework.step3.description"
    },
    {
      number: "04",
      icon: Rocket,
      titleKey: "howwework.step4.title",
      descriptionKey: "howwework.step4.description"
    }
  ];

  return (
    <section id="how-we-work" className="py-20 bg-gradient-to-b from-white via-[#D2D0F7]/10 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#BBFF2C]/10 border border-[#BBFF2C]/20 mb-4">
            <Rocket className="w-4 h-4 text-[#BBFF2C] mr-2" />
            <span className="text-sm text-[#51508E]">{t('howwework.badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#040725] mb-6">
            {t('howwework.title-1')}
            <span className="block text-[#51508E]">{t('howwework.title-2')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('howwework.subtitle')}
          </p>
        </div>

        {/* Launch Sequence Timeline */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Central Launch Tower */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#BBFF2C] via-[#7B93FF] to-[#FFC6F2] opacity-60"></div>
          
          {/* Rocket at top */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 bg-[#FC2D00] rounded-full flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>

          {/* Launch Stages */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} group`}
              >
                
                {/* Mission Stage Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  {/* Stage Header */}
                  <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-center space-x-4 ${index % 2 === 0 ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className="text-6xl font-mono text-[#BBFF2C] opacity-20 leading-none">
                        {step.number}
                      </div>
                      <div>
                        {/* Subtle Tech Element */}
                        <div className="w-12 h-12 border-2 border-[#BBFF2C]/30 rounded-lg flex items-center justify-center group-hover:border-[#BBFF2C] transition-all duration-300 relative">
                          <step.icon className="w-5 h-5 text-[#51508E] group-hover:text-[#BBFF2C] transition-colors" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FC2D00] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mission Brief */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-[#040725] group-hover:text-[#51508E] transition-colors">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                </div>

                {/* Central Launch Node */}
                <div className="relative z-10 w-2/12 flex justify-center">
                  <div className="w-6 h-6 bg-white border-4 border-[#BBFF2C] rounded-full shadow-lg group-hover:border-[#7B93FF] group-hover:scale-125 transition-all duration-300">
                    <div className="w-full h-full bg-[#BBFF2C] rounded-full group-hover:bg-[#7B93FF] transition-colors"></div>
                  </div>

                  {/* Connection Line to Content */}
                  <div className={`absolute top-1/2 w-8 h-0.5 bg-gradient-to-r from-[#BBFF2C] to-[#7B93FF] transform -translate-y-1/2 opacity-40 group-hover:opacity-80 transition-opacity ${
                    index % 2 === 0 ? 'right-full' : 'left-full'
                  }`}></div>
                </div>

                {/* Phase Indicator */}
                <div className="w-5/12 flex justify-center">
                  <div className={`space-y-2 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    {/* Phase Label */}
                    <div className="inline-flex items-center space-x-2 bg-[#040725]/5 rounded-full px-4 py-2 border border-[#BBFF2C]/20 group-hover:bg-[#BBFF2C]/10 transition-colors">
                      <div className="w-2 h-2 bg-[#FC2D00] rounded-full"></div>
                      <span className="text-xs text-[#51508E] font-mono">Phase {step.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Completion */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#040725]/90 to-[#51508E]/90 rounded-xl p-8 relative backdrop-blur-sm border border-[#BBFF2C]/10">
            {/* Main Message */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                {t('howwework.cta.title')}
              </h3>
              <p className="text-[#D2D0F7] leading-relaxed max-w-xl mx-auto text-sm">
                {t('howwework.cta.description')}
              </p>
              
              <div className="pt-2">
                <Button 
                  onClick={onOpenModal}
                  className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0 group px-6 py-2"
                  size="lg"
                >
                  {t('howwework.cta.button')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}