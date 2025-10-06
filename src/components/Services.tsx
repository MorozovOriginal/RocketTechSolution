import { Cog, BarChart, Brain, Rocket, Zap, Database } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useLanguage } from "./LanguageContext";

export default function Services() {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Cog,
      titleKey: "services.automation.title",
      descriptionKey: "services.automation.description",
      featureKeys: ["services.automation.feature-1", "services.automation.feature-2", "services.automation.feature-3", "services.automation.feature-4"]
    },
    {
      icon: BarChart,
      titleKey: "services.analytics.title", 
      descriptionKey: "services.analytics.description",
      featureKeys: ["services.analytics.feature-1", "services.analytics.feature-2", "services.analytics.feature-3", "services.analytics.feature-4"]
    },
    {
      icon: Brain,
      titleKey: "services.ai.title",
      descriptionKey: "services.ai.description", 
      featureKeys: ["services.ai.feature-1", "services.ai.feature-2", "services.ai.feature-3", "services.ai.feature-4"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-[#D2D0F7]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#BBFF2C]/10 border border-[#BBFF2C]/20 mb-4">
            <Rocket className="w-4 h-4 text-[#BBFF2C] mr-2" />
            <span className="text-sm text-[#51508E]">{t('services.badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#040725] mb-6">
            {t('services.title-1')}
            <span className="block text-[#51508E]">{t('services.title-2')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white group">
              {/* Gradient Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#BBFF2C] via-[#7B93FF] to-[#FFC6F2] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardContent className="relative bg-white rounded-lg p-8 h-full">
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#BBFF2C] to-[#7B93FF] rounded-xl flex items-center justify-center mb-4">
                      <service.icon className="w-8 h-8 text-[#040725]" />
                    </div>
                    {/* Pixel accent */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FC2D00] rounded-sm"></div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold text-[#040725] mb-3">{t(service.titleKey)}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{t(service.descriptionKey)}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {service.featureKeys.map((featureKey, idx) => (
                      <div key={idx} className="flex items-center">
                        <Zap className="w-4 h-4 text-[#BBFF2C] mr-3 flex-shrink-0" />
                        <span className="text-sm text-[#51508E]">{t(featureKey)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-[#51508E]">
            <Database className="w-5 h-5" />
            <span>{t('services.cta-text')}</span>
            <a href="#contact" className="text-[#51508E] hover:text-[#040725] transition-colors underline decoration-1 underline-offset-2">
              {t('services.cta-link')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}