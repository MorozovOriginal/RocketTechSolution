import { 
  Award, 
  HeadphonesIcon, 
  Building, 
  Users,
  Rocket,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";

export default function Features() {
  const { t } = useLanguage();
  const [hoveredProcess, setHoveredProcess] = useState<string | null>(null);

  const features = [
    {
      icon: Award,
      titleKey: "features.expertise.title",
      descriptionKey: "features.expertise.description"
    },
    {
      icon: HeadphonesIcon,
      titleKey: "features.support.title", 
      descriptionKey: "features.support.description"
    },
    {
      icon: Building,
      titleKey: "features.perspective.title",
      descriptionKey: "features.perspective.description"
    },
    {
      icon: Users,
      titleKey: "features.technology.title",
      descriptionKey: "features.technology.description"
    }
  ];

  // Business Innovation Framework processes
  const processSteps = [
    {
      id: "research",
      titleKey: "features.process.research.title",
      phaseKey: "features.process.research.phase",
      color: "bg-[#7B93FF]",
      textColor: "text-white",
      borderColor: "border-[#7B93FF]",
      position: { top: "15%", left: "20%" },
      connections: ["design", "prototype"],
      technologies: ["Market Analysis", "User Research", "Tech Audit"]
    },
    {
      id: "design",
      titleKey: "features.process.design.title",
      phaseKey: "features.process.design.phase",
      color: "bg-[#FFC6F2]",
      textColor: "text-[#040725]",
      borderColor: "border-[#FFC6F2]",
      position: { top: "15%", right: "20%" },
      connections: ["prototype", "develop"],
      technologies: ["UX/UI", "Architecture", "Workflows"]
    },
    {
      id: "prototype",
      titleKey: "features.process.prototype.title",
      phaseKey: "features.process.prototype.phase",
      color: "bg-[#BBFF2C]",
      textColor: "text-[#040725]",
      borderColor: "border-[#BBFF2C]",
      position: { top: "45%", left: "10%" },
      connections: ["develop", "test"],
      technologies: ["MVP", "Testing", "Validation"]
    },
    {
      id: "develop",
      titleKey: "features.process.develop.title",
      phaseKey: "features.process.develop.phase",
      color: "bg-[#FC2D00]",
      textColor: "text-white",
      borderColor: "border-[#FC2D00]",
      position: { top: "45%", right: "10%" },
      connections: ["test", "support"],
      technologies: ["Frontend", "Backend", "Integration"]
    },
    {
      id: "test",
      titleKey: "features.process.test.title",
      phaseKey: "features.process.test.phase",
      color: "bg-[#51508E]",
      textColor: "text-white",
      borderColor: "border-[#51508E]",
      position: { bottom: "15%", left: "20%" },
      connections: ["support"],
      technologies: ["Testing", "Security", "Performance"]
    },
    {
      id: "support",
      titleKey: "features.process.support.title",
      phaseKey: "features.process.support.phase",
      color: "bg-[#D2D0F7]",
      textColor: "text-[#040725]",
      borderColor: "border-[#D2D0F7]",
      position: { bottom: "15%", right: "20%" },
      connections: ["research"],
      technologies: ["Monitoring", "Updates", "Optimization"]
    }
  ];

  const getConnectionPath = (from: string, to: string) => {
    const fromProcess = processSteps.find(p => p.id === from);
    const toProcess = processSteps.find(p => p.id === to);
    
    if (!fromProcess || !toProcess) return "";

    // Calculate approximate positions based on percentage values
    const fromX = fromProcess.position.left ? parseFloat(fromProcess.position.left) : (100 - parseFloat(fromProcess.position.right || "0"));
    const fromY = fromProcess.position.top ? parseFloat(fromProcess.position.top) : (100 - parseFloat(fromProcess.position.bottom || "0"));
    const toX = toProcess.position.left ? parseFloat(toProcess.position.left) : (100 - parseFloat(toProcess.position.right || "0"));
    const toY = toProcess.position.top ? parseFloat(toProcess.position.top) : (100 - parseFloat(toProcess.position.bottom || "0"));

    return `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 - 8} ${toX} ${toY}`;
  };

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-[#040725] to-[#051040] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#BBFF2C] rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-[#7B93FF] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-[#FFC6F2] rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Features List */}
          <div className="space-y-10">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {t('features.title-1')}
                <span className="block text-[#BBFF2C]">{t('features.title-2')}</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                {t('features.subtitle')}
              </p>
            </div>

            <div className="grid gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-5 group hover:translate-x-2 transition-transform duration-300">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#BBFF2C] to-[#7B93FF] rounded-xl flex items-center justify-center shadow-lg">
                    <feature.icon className="w-7 h-7 text-[#040725]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#BBFF2C] transition-colors">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-lg">{t(feature.descriptionKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Business Innovation Framework */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full h-[700px] bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm p-8">
              
              {/* Process Flow Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="processGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BBFF2C" stopOpacity="0.7"/>
                    <stop offset="50%" stopColor="#7B93FF" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#FFC6F2" stopOpacity="0.7"/>
                  </linearGradient>
                </defs>
                
                {processSteps.map(process => 
                  process.connections.map(connectionId => (
                    <path
                      key={`${process.id}-${connectionId}`}
                      d={getConnectionPath(process.id, connectionId)}
                      stroke="url(#processGradient)"
                      strokeWidth={hoveredProcess === process.id || hoveredProcess === connectionId ? "3" : "2"}
                      fill="none"
                      strokeDasharray="8,4"
                      className={`transition-all duration-300 ${ 
                        hoveredProcess === process.id || hoveredProcess === connectionId 
                          ? "opacity-90" 
                          : "opacity-40"
                      }`}
                      style={{
                        animation: hoveredProcess === process.id || hoveredProcess === connectionId 
                          ? "connection-draw 2s ease-in-out infinite alternate" 
                          : "none"
                      }}
                    />
                  ))
                )}
              </svg>

              {/* Central RTS Hub */}
              <div 
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 bg-gradient-to-br from-[#BBFF2C] to-[#FC2D00] rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
                style={{ animation: "skill-pulse 3s ease-in-out infinite" }}
              >
                <div className="w-16 h-16 bg-[#040725] rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-[#BBFF2C]" />
                </div>
              </div>

              {/* Process Steps */}
              {processSteps.map((process) => (
                <div
                  key={process.id}
                  className={`absolute z-20 cursor-pointer transition-all duration-300 ${
                    hoveredProcess === process.id 
                      ? "z-30" 
                      : hoveredProcess && hoveredProcess !== process.id
                        ? "opacity-70" 
                        : "opacity-100"
                  }`}
                  style={{
                    ...process.position,
                    animation: hoveredProcess === process.id ? "skill-hover 0.3s ease-out forwards" : "none"
                  }}
                  onMouseEnter={() => setHoveredProcess(process.id)}
                  onMouseLeave={() => setHoveredProcess(null)}
                >
                  {/* Process Card */}
                  <div className={`${process.color} ${process.textColor} rounded-xl p-4 shadow-lg backdrop-blur-sm border-2 ${process.borderColor} min-w-[200px] max-w-[220px]`}>
                    {/* Phase Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold opacity-75">{t(process.phaseKey)}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </div>
                    
                    <h3 className="font-bold text-sm leading-tight mb-3">{t(process.titleKey)}</h3>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1">
                      {process.technologies.map((tech, index) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-white/20 rounded-md backdrop-blur-sm font-medium"
                          style={{
                            animation: hoveredProcess === process.id 
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

              {/* Floating Process Indicators */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#BBFF2C] rounded-full animate-ping"></div>
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-[#7B93FF] rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-8 w-1 h-1 bg-[#FFC6F2] rounded-full animate-ping"></div>
              <div className="absolute bottom-1/3 left-4 w-1.5 h-1.5 bg-[#FC2D00] rounded-full animate-pulse"></div>
              

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}