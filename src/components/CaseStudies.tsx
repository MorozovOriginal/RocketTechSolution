import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Trophy,
  Calculator,
  Cog,
  Brain,
  BarChart,
  X,
  ExternalLink,
  Rocket,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import LazyImage from "./LazyImage";
import ProgressiveLoader from "./ProgressiveLoader";
import { getHomepageSolutions, getHomepageSolutionsFromDb } from "./AllSolutions";
import { useLanguage } from "./LanguageContext";

// Helper function to get localized text
function getLocalizedText(en: string, ru?: string, isRussian: boolean = false): string {
  return isRussian && ru && ru.trim() !== '' ? ru : en;
}

// Helper function to get localized array
function getLocalizedArray(en: string[], ru?: string[], isRussian: boolean = false): string[] {
  return isRussian && ru && ru.length > 0 ? ru : en;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  descriptionRu?: string;
  icon: React.ComponentType<any>;
  image: string;
  technologies: string[];
  fullDescription: string;
  fullDescriptionRu?: string;
  uniqueFeatures: string[];
  uniqueFeaturesRu?: string[];
  keyBenefits: string[];
  keyBenefitsRu?: string[];
  additionalImages: string[];
  category: string;
  industry: string;
  timeframe: string;
  result: string;
  showOnHomepage?: boolean;
}

interface CaseStudiesProps {
  onOpenModal: () => void;
  onOpenAllSolutions: () => void;
}

export default function CaseStudies({
  onOpenModal,
  onOpenAllSolutions,
}: CaseStudiesProps) {
  const { t, language } = useLanguage();
  const isRussian = language === 'ru';
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load homepage solutions from AllSolutions
  useEffect(() => {
    let isMounted = true;
    
    const loadHomepageSolutions = async () => {
      try {
        // Add a small delay to prevent potential race conditions
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isMounted) return;
        
        // Try to load from database first, with localStorage fallback
        const homepageSolutions = await getHomepageSolutionsFromDb();
        
        if (isMounted) {
          setCaseStudies(homepageSolutions);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading homepage solutions:', error);
        if (isMounted) {
          // Fallback to localStorage-only function
          try {
            const fallbackSolutions = getHomepageSolutions();
            setCaseStudies(fallbackSolutions);
          } catch (fallbackError) {
            console.error('Fallback loading also failed:', fallbackError);
            setCaseStudies([]); // Ultimate fallback to empty array
          }
          setIsLoading(false);
        }
      }
    };

    // Load initially with timeout protection
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('CaseStudies: Loading timeout, falling back to empty state');
        setCaseStudies([]);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    loadHomepageSolutions().finally(() => {
      clearTimeout(timeoutId);
    });

    // Listen for localStorage changes (when admin updates solutions)
    const handleStorageChange = () => {
      try {
        if (isMounted) {
          loadHomepageSolutions();
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when localStorage is updated in the same tab
    window.addEventListener('allSolutionsUpdated', handleStorageChange);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('allSolutionsUpdated', handleStorageChange);
    };
  }, []);



  const openModal = (study: CaseStudy) => {
    setSelectedCase(study);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedCase(null);
    document.body.style.overflow = "unset";
  };

  const handleGetStarted = () => {
    closeModal(); // Close the Solution modal
    setTimeout(() => {
      onOpenModal(); // Open the project request form after a small delay
    }, 150);
  };

  return (
    <section
      id="our-solutions"
      className="py-20 bg-gradient-to-b from-white via-[#D2D0F7]/10 to-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(187, 255, 44, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(187, 255, 44, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-[#BBFF2C] rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-1 h-1 bg-[#7B93FF] rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#FFC6F2] rounded-full animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#BBFF2C]/10 border border-[#BBFF2C]/20 mb-4">
            <Rocket className="w-4 h-4 text-[#BBFF2C] mr-2" />
            <span className="text-sm text-[#51508E]">
              {t('casestudies.badge')}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#040725] mb-6">
            {t('casestudies.title-1')}
            <span className="block text-[#51508E]">
              {t('casestudies.title-2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('casestudies.subtitle')}
          </p>
        </div>

        {/* Our Solutions Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 text-gray-600">
              <div className="animate-spin w-6 h-6 border-2 border-[#BBFF2C] border-t-transparent rounded-full"></div>
              <span>{t('casestudies.loading')}</span>
            </div>
          </div>
        ) : caseStudies && caseStudies.length > 0 ? (
          <ProgressiveLoader 
            delay={200} 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            fallback={
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[420px] bg-gradient-to-br from-[#D2D0F7]/30 to-[#BBFF2C]/10 rounded-lg animate-pulse" />
                ))}
              </div>
            }
          >
            {caseStudies.filter(study => study && study.id).map((study) => (
            <div
              key={study.id}
              className="group cursor-pointer transition-all duration-300 hover:-translate-y-2"
              onClick={() => openModal(study)}
            >
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-[420px] group-hover:shadow-2xl group-hover:shadow-[#BBFF2C]/20">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <LazyImage
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      placeholder={
                        <div className="w-full h-full bg-gradient-to-br from-[#D2D0F7] to-[#BBFF2C]/20 animate-pulse flex items-center justify-center">
                          <div className="text-[#51508E] text-sm">Loading...</div>
                        </div>
                      }
                      onError={() => {
                        console.warn("Image failed to load:", study.image);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040725]/60 via-transparent to-transparent"></div>

                    {/* Icon */}
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-[#BBFF2C] rounded-lg flex items-center justify-center shadow-lg">
                        {study.icon && <study.icon className="w-6 h-6 text-[#040725]" />}
                      </div>
                    </div>

                    {/* Pixel accent */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-[#FC2D00] rounded-sm"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-[#040725] mb-2 group-hover:text-[#51508E] transition-colors line-clamp-2">
                          {study.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {getLocalizedText(study.description, study.descriptionRu, isRussian)}
                        </p>
                      </div>

                      {/* Technologies Preview - Ограничиваем до 2 технологий */}
                      <div className="flex flex-wrap gap-1">
                        {study.technologies
                          .slice(0, 2)
                          .map((tech, idx) => (
                            <Badge
                              key={`${study.id}-tech-${idx}`}
                              variant="secondary"
                              className="text-xs bg-[#D2D0F7] text-[#51508E] hover:bg-[#BBFF2C] hover:text-[#040725] transition-colors"
                            >
                              {tech.length > 12
                                ? `${tech.substring(0, 12)}...`
                                : tech}
                            </Badge>
                          ))}
                        {study.technologies.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-[#51508E] text-white"
                          >
                            +{study.technologies.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-3">
                      <span className="text-sm text-[#51508E] group-hover:text-[#BBFF2C] transition-colors">
                        {t('casestudies.view-details')}
                      </span>
                      <ExternalLink className="w-4 h-4 text-[#51508E] group-hover:text-[#BBFF2C] transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          </ProgressiveLoader>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center space-y-4 p-8 rounded-2xl bg-gradient-to-r from-[#BBFF2C]/5 to-[#7B93FF]/5 border border-[#BBFF2C]/20">
              <Rocket className="w-12 h-12 text-[#BBFF2C]" />
              <h3 className="text-xl font-semibold text-[#040725]">
                {t('casestudies.no-solutions.title')}
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                {t('casestudies.no-solutions.description')}
              </p>
              <Button
                variant="outline"
                onClick={onOpenAllSolutions}
                className="border-[#BBFF2C] text-[#040725] hover:bg-[#BBFF2C] hover:text-[#040725] transition-all duration-300 group"
              >
                <span>{t('casestudies.view-all-solutions')}</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {/* More Cases Link */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center space-y-4 p-6 rounded-2xl bg-gradient-to-r from-[#BBFF2C]/5 to-[#7B93FF]/5 border border-[#BBFF2C]/20">
            <div className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-[#BBFF2C]" />
              <span className="text-lg font-semibold text-[#040725]">
                {t('casestudies.more-projects.title')}
              </span>
            </div>
            <p className="text-gray-600 text-center max-w-md">
              {t('casestudies.more-projects.description')}
            </p>
            <Button
              variant="outline"
              onClick={onOpenAllSolutions}
              className="border-[#BBFF2C] text-[#040725] hover:bg-[#BBFF2C] hover:text-[#040725] transition-all duration-300 group"
            >
              <span>{t('casestudies.view-all-solutions')}</span>
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-[#BBFF2C]">
              50+
            </div>
            <p className="text-sm text-gray-600">
              {t('casestudies.stats.projects')}
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#7B93FF]">
              95%
            </div>
            <p className="text-sm text-gray-600">
              {t('casestudies.stats.satisfaction')}
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#FFC6F2]">
              80%
            </div>
            <p className="text-sm text-gray-600">
              {t('casestudies.stats.savings')}
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#FC2D00]">
              ∞
            </div>
            <p className="text-sm text-gray-600">
              {t('casestudies.stats.growth')}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-[#040725]" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#BBFF2C] to-[#7B93FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <selectedCase.icon className="w-8 h-8 text-[#040725]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-[#040725] mb-2">
                    {selectedCase.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {getLocalizedText(selectedCase.fullDescription, selectedCase.fullDescriptionRu, isRussian)}
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {selectedCase.additionalImages.slice(0, 1).map(
                  (img, idx) => (
                    <div
                      key={`${selectedCase.id}-img-${idx}`}
                      className="relative rounded-lg overflow-hidden"
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${selectedCase.title} screenshot ${idx + 1}`}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          console.warn(
                            "Modal image failed to load:",
                            img,
                          );
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#040725]/20 to-transparent"></div>
                    </div>
                  ),
                )}
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Technologies */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-[#BBFF2C]" />
                    <h4 className="font-bold text-[#040725]">
                      {t('casestudies.modal.technologies')}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {selectedCase.technologies.map(
                      (tech, idx) => (
                        <Badge
                          key={`${selectedCase.id}-modal-tech-${idx}`}
                          variant="outline"
                          className="block w-fit border-[#D2D0F7] text-[#51508E]"
                        >
                          {tech}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                {/* Unique Features */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-5 h-5 text-[#7B93FF]" />
                    <h4 className="font-bold text-[#040725]">
                      {t('casestudies.modal.features')}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {getLocalizedArray(selectedCase.uniqueFeatures, selectedCase.uniqueFeaturesRu, isRussian).map(
                      (feature, idx) => (
                        <li
                          key={`${selectedCase.id}-feature-${idx}`}
                          className="flex items-start space-x-2"
                        >
                          <div className="w-1.5 h-1.5 bg-[#7B93FF] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {/* Key Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BarChart className="w-5 h-5 text-[#FFC6F2]" />
                    <h4 className="font-bold text-[#040725]">
                      {t('casestudies.modal.benefits')}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {getLocalizedArray(selectedCase.keyBenefits, selectedCase.keyBenefitsRu, isRussian).map(
                      (benefit, idx) => (
                        <li
                          key={`${selectedCase.id}-benefit-${idx}`}
                          className="flex items-start space-x-2"
                        >
                          <div className="w-1.5 h-1.5 bg-[#FFC6F2] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">
                            {benefit}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-[#BBFF2C]/10 to-[#7B93FF]/10 rounded-lg p-6 border border-[#BBFF2C]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#040725] mb-1">
                        {t('casestudies.modal.ready')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('casestudies.modal.description')}
                      </p>
                    </div>
                    <Button
                      onClick={handleGetStarted}
                      className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0"
                    >
                      {t('casestudies.modal.get-started')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}