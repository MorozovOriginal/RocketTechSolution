import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { 
  Database, 
  Settings, 
  Bot, 
  Brain, 
  GitBranch,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Calendar,
  Target
} from "lucide-react";

interface JourneyPoint {
  year: number;
  automationLevel: number;
  titleKey: string;
  descriptionKey: string;
  detailsKeys: string[];
  icon: React.ComponentType<any>;
  color: string;
  achievementsKeys: string[];
}

export default function JourneyChart() {
  const { t } = useLanguage();
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const journeyData: JourneyPoint[] = [
    {
      year: 2021,
      automationLevel: 20,
      titleKey: 'brand.journey.2021.title',
      descriptionKey: 'brand.journey.2021.description',
      detailsKeys: [
        'brand.journey.2021.detail1',
        'brand.journey.2021.detail2',
        'brand.journey.2021.detail3'
      ],
      icon: Settings,
      color: "#FC2D00",
      achievementsKeys: [
        'brand.journey.2021.achievement1',
        'brand.journey.2021.achievement2'
      ]
    },
    {
      year: 2022,
      automationLevel: 40,
      titleKey: 'brand.journey.2022.title',
      descriptionKey: 'brand.journey.2022.description',
      detailsKeys: [
        'brand.journey.2022.detail1',
        'brand.journey.2022.detail2',
        'brand.journey.2022.detail3'
      ],
      icon: Database,
      color: "#7B93FF",
      achievementsKeys: [
        'brand.journey.2022.achievement1',
        'brand.journey.2022.achievement2'
      ]
    },
    {
      year: 2023,
      automationLevel: 65,
      titleKey: 'brand.journey.2023.title',
      descriptionKey: 'brand.journey.2023.description',
      detailsKeys: [
        'brand.journey.2023.detail1',
        'brand.journey.2023.detail2',
        'brand.journey.2023.detail3'
      ],
      icon: GitBranch,
      color: "#FFC6F2",
      achievementsKeys: [
        'brand.journey.2023.achievement1',
        'brand.journey.2023.achievement2'
      ]
    },
    {
      year: 2024,
      automationLevel: 80,
      titleKey: 'brand.journey.2024.title',
      descriptionKey: 'brand.journey.2024.description',
      detailsKeys: [
        'brand.journey.2024.detail1',
        'brand.journey.2024.detail2',
        'brand.journey.2024.detail3'
      ],
      icon: Bot,
      color: "#BBFF2C",
      achievementsKeys: [
        'brand.journey.2024.achievement1',
        'brand.journey.2024.achievement2'
      ]
    },
    {
      year: 2025,
      automationLevel: 95,
      titleKey: 'brand.journey.2025.title',
      descriptionKey: 'brand.journey.2025.description',
      detailsKeys: [
        'brand.journey.2025.detail1',
        'brand.journey.2025.detail2',
        'brand.journey.2025.detail3'
      ],
      icon: Brain,
      color: "#BBFF2C",
      achievementsKeys: [
        'brand.journey.2025.achievement1',
        'brand.journey.2025.achievement2'
      ]
    }
  ];

  const toggleExpanded = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">



      {/* Timeline */}
      <div className="relative">
        {/* Central line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FC2D00] via-[#7B93FF] via-[#FFC6F2] to-[#BBFF2C] transform md:-translate-x-0.5" />
        
        {/* Timeline items */}
        <div className="space-y-8">
          {journeyData.map((point, index) => {
            const Icon = point.icon;
            const isExpanded = expandedYear === point.year;
            const isEven = index % 2 === 0;
            
            return (
              <div key={point.year} className="relative journey-timeline-item" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-3 border-white cursor-pointer transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: point.color }}
                    onClick={() => toggleExpanded(point.year)}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content card */}
                <div className={`
                  ml-20 md:ml-0
                  ${isEven ? 'md:mr-1/2 md:pr-8' : 'md:ml-1/2 md:pl-8'}
                `}>
                  <div 
                    className={`
                      bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer 
                      transition-all duration-300 hover:shadow-xl hover:border-[#BBFF2C]/30
                      ${isExpanded ? 'ring-2 ring-[#BBFF2C]/30 shadow-xl' : ''}
                    `}
                    onClick={() => toggleExpanded(point.year)}
                  >
                    {/* Card header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#040725] text-white px-3 py-1 rounded-lg text-sm font-bold">
                            {point.year}
                          </div>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: point.color }}
                            />
                            <span className="text-xs text-gray-500 font-medium">
                              {point.automationLevel}% {t('brand.journey.automation')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-sm font-medium">
                            {isExpanded ? t('brand.journey.details.less') : t('brand.journey.details.more')}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-[#040725] mb-2">
                        {t(point.titleKey)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t(point.descriptionKey)}
                      </p>
                    </div>

                    {/* Expandable details */}
                    <div className={`
                      overflow-hidden transition-all duration-500 ease-out
                      ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Key implementations */}
                          <div>
                            <h4 className="font-bold text-[#040725] mb-3 flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: point.color }}
                              />
                              {t('brand.journey.details.implementations')}
                            </h4>
                            <ul className="space-y-2">
                              {point.detailsKeys.map((detailKey, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-gray-600">{t(detailKey)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Achievements */}
                          <div>
                            <h4 className="font-bold text-[#040725] mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-[#BBFF2C]" />
                              {t('brand.journey.details.achievements')}
                            </h4>
                            <ul className="space-y-2">
                              {point.achievementsKeys.map((achievementKey, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <div 
                                    className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                                    style={{ backgroundColor: point.color }}
                                  />
                                  <span className="text-gray-600">{t(achievementKey)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Comparison Summary */}
      <div className="mt-16 bg-gradient-to-br from-[#040725] to-[#051040] rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-[#BBFF2C]" />
            <h3 className="text-2xl font-bold">{t('brand.journey.comparison.title')}</h3>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {t('brand.journey.comparison.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Our Journey - 5 Years */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#FC2D00]/30 transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FC2D00]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#FC2D00]" />
              </div>
              <div className="text-4xl font-bold text-[#FC2D00] mb-2">5 {t('brand.journey.comparison.years')}</div>
              <h4 className="text-xl font-bold text-white mb-3">{t('brand.journey.comparison.our_journey.title')}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('brand.journey.comparison.our_journey.description')}
              </p>
              
              {/* Progress bar for our journey */}
              <div className="mt-4 relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FC2D00] via-[#7B93FF] via-[#FFC6F2] to-[#BBFF2C] rounded-full transition-all duration-2000 ease-out journey-progress-bar"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>2021</span>
                <span>2025</span>
              </div>
            </div>
          </div>

          {/* Your Journey - 2 weeks to 3 months */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#BBFF2C]/30 transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#BBFF2C]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#BBFF2C]" />
              </div>
              <div className="text-4xl font-bold text-[#BBFF2C] mb-2">
                2-8 {t('brand.journey.comparison.weeks')}
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{t('brand.journey.comparison.your_journey.title')}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('brand.journey.comparison.your_journey.description')}
              </p>
              
              {/* Progress bar for client journey */}
              <div className="mt-4 relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#BBFF2C] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{t('brand.journey.comparison.start')}</span>
                <span>{t('brand.journey.comparison.launch')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <p className="text-lg text-[#BBFF2C] font-medium">
            {t('brand.journey.comparison.bottom_message')}
          </p>
        </div>
      </div>

    </div>
  );
}