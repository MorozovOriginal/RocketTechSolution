import { useState } from "react";
import { 
  Bot, 
  Brain, 
  BarChart3, 
  Code, 
  Database, 
  GraduationCap, 
  Rocket, 
  ExternalLink,
  Users,
  Globe,
  Zap
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface AboutProps {
  onOpenBrandPlatform: () => void;
}

export default function About({ onOpenBrandPlatform }: AboutProps) {
  const { t } = useLanguage();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const stats = [
    { number: "50+", labelKey: "about.stats.projects", icon: Zap },
    { number: "10+", labelKey: "about.stats.experts", icon: Users },
    { number: "15+", labelKey: "about.stats.products", icon: Brain }
  ];

  const skillModules = [
    {
      id: "automation",
      titleKey: "about.skills.automation",
      icon: Bot,
      color: "bg-[#BBFF2C]",
      textColor: "text-[#040725]",
      borderColor: "border-[#BBFF2C]",
      position: { top: "10%", left: "15%" },
      technologies: ["Telegram", "Discord", "VK", "n8n", "Python", "API"],
      connections: ["ai", "analytics", "education"]
    },
    {
      id: "ai",
      titleKey: "about.skills.ai",
      icon: Brain,
      color: "bg-[#7B93FF]",
      textColor: "text-white",
      borderColor: "border-[#7B93FF]",
      position: { top: "15%", right: "15%" },
      technologies: ["NLP", "RAG", "CV", "Transformers", "AI Agents"],
      connections: ["automation", "analytics", "education", "data"]
    },
    {
      id: "analytics",
      titleKey: "about.skills.analytics",
      icon: BarChart3,
      color: "bg-[#FFC6F2]",
      textColor: "text-[#040725]",
      borderColor: "border-[#FFC6F2]",
      position: { top: "60%", left: "10%" },
      technologies: ["SQL", "BigQuery", "Python", "Looker Studio", "Dashboards"],
      connections: ["automation", "ai", "data", "engineering"]
    },
    {
      id: "engineering",
      titleKey: "about.skills.engineering",
      icon: Code,
      color: "bg-[#FC2D00]",
      textColor: "text-white",
      borderColor: "border-[#FC2D00]",
      position: { bottom: "10%", left: "20%" },
      technologies: ["Backend", "Integrations", "Web Apps", "C#", "Django", "Flask"],
      connections: ["analytics", "data"]
    },
    {
      id: "data",
      titleKey: "about.skills.data",
      icon: Database,
      color: "bg-[#51508E]",
      textColor: "text-white",
      borderColor: "border-[#51508E]",
      position: { bottom: "15%", right: "20%" },
      technologies: ["ETL", "Data Pipelines", "Google Cloud", "Postgres", "Clickhouse"],
      connections: ["ai", "analytics", "engineering"]
    },
    {
      id: "education",
      titleKey: "about.skills.education",
      icon: GraduationCap,
      color: "bg-[#D2D0F7]",
      textColor: "text-[#040725]",
      borderColor: "border-[#D2D0F7]",
      position: { top: "45%", right: "10%" },
      technologies: ["Python", "AI", "Workflow Automation (n8n)"],
      connections: ["automation", "ai"]
    }
  ];

  const getConnectionPath = (from: any, to: any) => {
    const fromModule = skillModules.find(m => m.id === from);
    const toModule = skillModules.find(m => m.id === to);
    
    if (!fromModule || !toModule) return "";

    // Calculate approximate positions based on percentage values
    const fromX = fromModule.position.left ? parseFloat(fromModule.position.left) : (100 - parseFloat(fromModule.position.right || "0"));
    const fromY = fromModule.position.top ? parseFloat(fromModule.position.top) : (100 - parseFloat(fromModule.position.bottom || "0"));
    const toX = toModule.position.left ? parseFloat(toModule.position.left) : (100 - parseFloat(toModule.position.right || "0"));
    const toY = toModule.position.top ? parseFloat(toModule.position.top) : (100 - parseFloat(toModule.position.bottom || "0"));

    return `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 - 10} ${toX} ${toY}`;
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-[#040725] via-[#051040] to-[#040725] relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-[#BBFF2C] rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-[#7B93FF] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-[#FFC6F2] rounded-full animate-ping"></div>
        <div className="absolute top-20 left-1/3 w-1 h-1 bg-[#FC2D00] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/5 w-1.5 h-1.5 bg-[#BBFF2C] rounded-full animate-ping"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(187, 255, 44, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(187, 255, 44, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Interactive Skill Map */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full h-[700px] bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm p-8">
              
              {/* Connection Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BBFF2C" stopOpacity="0.6"/>
                    <stop offset="50%" stopColor="#7B93FF" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#FFC6F2" stopOpacity="0.6"/>
                  </linearGradient>
                </defs>
                
                {skillModules.map(module => 
                  module.connections.map(connectionId => (
                    <path
                      key={`${module.id}-${connectionId}`}
                      d={getConnectionPath(module.id, connectionId)}
                      stroke="url(#connectionGradient)"
                      strokeWidth={hoveredSkill === module.id || hoveredSkill === connectionId ? "3" : "1.5"}
                      fill="none"
                      strokeDasharray="5,5"
                      className={`transition-all duration-300 ${
                        hoveredSkill === module.id || hoveredSkill === connectionId 
                          ? "opacity-80" 
                          : "opacity-30"
                      }`}
                      style={{
                        animation: hoveredSkill === module.id || hoveredSkill === connectionId 
                          ? "connection-draw 2s ease-in-out infinite alternate" 
                          : "none"
                      }}
                    />
                  ))
                )}
              </svg>

              {/* Central RTS Logo */}
              <div 
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 bg-gradient-to-br from-[#BBFF2C] to-[#7B93FF] rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
                style={{ animation: "skill-pulse 3s ease-in-out infinite" }}
              >
                <div className="w-20 h-20 bg-[#040725] rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-[#BBFF2C]" />
                </div>
              </div>

              {/* Skill Modules */}
              {skillModules.map((module) => (
                <div
                  key={module.id}
                  className={`absolute z-20 cursor-pointer transition-all duration-300 ${
                    hoveredSkill === module.id 
                      ? "z-30" 
                      : hoveredSkill && hoveredSkill !== module.id
                        ? "opacity-60" 
                        : "opacity-100"
                  }`}
                  style={{
                    ...module.position,
                    animation: hoveredSkill === module.id ? "skill-hover 0.3s ease-out forwards" : "none"
                  }}
                  onMouseEnter={() => setHoveredSkill(module.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Main Skill Card */}
                  <div className={`${module.color} ${module.textColor} rounded-xl p-5 shadow-lg backdrop-blur-sm border-2 ${module.borderColor} min-w-[220px] max-w-[250px]`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                        <module.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm leading-tight">{t(module.titleKey)}</h3>
                    </div>
                    
                    {/* Technologies Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {module.technologies.map((tech, index) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1.5 bg-white/20 rounded-md backdrop-blur-sm font-medium"
                          style={{
                            animation: hoveredSkill === module.id 
                              ? `tech-tag-appear 0.3s ease-out ${index * 0.1}s both` 
                              : "none"
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Floating Particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#BBFF2C] rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-[#7B93FF] rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-8 w-1 h-1 bg-[#FFC6F2] rounded-full animate-ping"></div>
              <div className="absolute bottom-1/3 left-4 w-1.5 h-1.5 bg-[#FC2D00] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {t('about.title-1')}
                <span className="block text-[#BBFF2C]">{t('about.title-2')}</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  {t('about.description-1')}
                </p>
                <p>
                  {t('about.description-2')}
                </p>
                <p>
                  {t('about.description-3')}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#BBFF2C]/30 transition-all duration-300 group hover:bg-white/10">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-[#BBFF2C]/20 rounded-lg flex items-center justify-center group-hover:bg-[#BBFF2C]/30 transition-colors">
                      <stat.icon className="w-5 h-5 text-[#BBFF2C] group-hover:text-[#7B93FF] transition-colors" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                  </div>
                  <div className="text-sm text-gray-400">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>

            {/* Mission & Vision */}
            <div className="space-y-8">
              {/* Vision */}
              <div className="bg-gradient-to-r from-[#7B93FF]/10 to-[#FFC6F2]/10 rounded-xl p-6 border border-[#7B93FF]/20 backdrop-blur-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#7B93FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{t('about.vision.title')}</h3>
                    <p className="text-gray-300">
                      {t('about.vision.description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* More Info Link */}
              <div className="text-center pt-8">
                <button 
                  onClick={onOpenBrandPlatform}
                  className="inline-flex items-center text-sm text-[#BBFF2C] hover:text-[#7B93FF] transition-colors group"
                >
                  <span>{t('about.learn-more')}</span>
                  <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}