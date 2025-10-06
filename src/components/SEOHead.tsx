import { useEffect } from 'react';
import { useLanguage } from './LanguageContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage,
  canonical
}: SEOHeadProps) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  const defaultTitle = isRussian 
    ? 'RTS - Rocket Tech Solutions | Автоматизация и ИИ решения для бизнеса'
    : 'RTS - Rocket Tech Solutions | Business Automation & AI Solutions';
    
  const defaultDescription = isRussian
    ? 'Rocket Tech Solutions предоставляет передовые решения по автоматизации бизнес-процессов, разработке ИИ-агентов и интеграции платёжных систем. Ускоряем ваш бизнес с помощью современных технологий.'
    : 'Rocket Tech Solutions provides cutting-edge business process automation, AI agent development, and payment system integration. Accelerate your business with modern technology solutions.';

  const defaultKeywords = isRussian
    ? 'автоматизация бизнеса, ИИ агенты, разработка ботов, интеграция API, аналитика, дашборды, RTS, Rocket Tech Solutions'
    : 'business automation, AI agents, bot development, API integration, analytics, dashboards, RTS, Rocket Tech Solutions';

  useEffect(() => {
    // Update document title
    document.title = title || defaultTitle;

    // Update meta description
    updateMetaTag('description', description || defaultDescription);
    
    // Update meta keywords
    updateMetaTag('keywords', keywords || defaultKeywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title || defaultTitle, 'property');
    updateMetaTag('og:description', description || defaultDescription, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:site_name', 'Rocket Tech Solutions', 'property');
    
    if (ogImage) {
      updateMetaTag('og:image', ogImage, 'property');
    }
    
    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title || defaultTitle);
    updateMetaTag('twitter:description', description || defaultDescription);
    
    if (ogImage) {
      updateMetaTag('twitter:image', ogImage);
    }
    
    // Update language and canonical
    updateMetaTag('language', language);
    document.documentElement.lang = language;
    
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }
    
    // Update viewport for better mobile experience
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    
    // Add theme color
    updateMetaTag('theme-color', '#BBFF2C');
    
    // Add structured data for organization
    updateStructuredData();
    
  }, [title, description, keywords, ogImage, canonical, language, isRussian]);

  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  };

  const updateLinkTag = (rel: string, href: string) => {
    let tag = document.querySelector(`link[rel="${rel}"]`);
    
    if (!tag) {
      tag = document.createElement('link');
      tag.setAttribute('rel', rel);
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('href', href);
  };

  const updateStructuredData = () => {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Rocket Tech Solutions",
      "alternateName": "RTS",
      "url": typeof window !== 'undefined' ? window.location.origin : '',
      "logo": {
        "@type": "ImageObject",
        "url": `${typeof window !== 'undefined' ? window.location.origin : ''}/favicon.ico`
      },
      "description": isRussian 
        ? "Компания по автоматизации бизнес-процессов и разработке ИИ-решений"
        : "Business process automation and AI solution development company",
      "foundingDate": "2020",
      "sameAs": [],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Russian", "English"]
      },
      "areaServed": {
        "@type": "Place",
        "name": "Worldwide"
      },
      "serviceType": [
        isRussian ? "Автоматизация бизнес-процессов" : "Business Process Automation",
        isRussian ? "Разработка ИИ-агентов" : "AI Agent Development", 
        isRussian ? "Интеграция API" : "API Integration",
        isRussian ? "Веб-разработка" : "Web Development",
        isRussian ? "Аналитические решения" : "Analytics Solutions"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything visible
}