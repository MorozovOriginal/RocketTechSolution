import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Rocket, 
  Search,
  Filter,
  X,
  ExternalLink,
  Zap,
  BarChart,
  MessageSquare,
  Trophy,
  Calculator,
  Cog,
  Brain,
  ChevronDown,
  Sparkles,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Home
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedLogo from "./AnimatedLogo";
import TypingAnimation from "./TypingAnimation";
import { caseStudiesApi, type CaseStudy as ApiCaseStudy } from "../utils/caseStudiesApi";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./ui/sonner";
import CaseStudiesSync from "../utils/caseStudiesSync";
import { safeLocalStorage, createDebouncedSave } from "../utils/safeLocalStorage";
import SyncStatus from "./SyncStatus";
import DbOperationsLog from "./DbOperationsLog";
import HealthCheck from "./HealthCheck";
import SystemStatus from "./SystemStatus";
import ConnectionStatus from "./ConnectionStatus";
import QuietHealthMonitor from "./QuietHealthMonitor";
import PerformanceStats from "./PerformanceStats";

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

interface AllSolutionsProps {
  onClose: () => void;
  onOpenModal: () => void;
}

// Helper function to get localized text
function getLocalizedText(en: string, ru?: string, isRussian: boolean = false): string {
  return isRussian && ru && ru.trim() !== '' ? ru : en;
}

// Helper function to get localized array
function getLocalizedArray(en: string[], ru?: string[], isRussian: boolean = false): string[] {
  return isRussian && ru && ru.length > 0 ? ru : en;
}

export default function AllSolutions({ onClose, onOpenModal }: AllSolutionsProps) {
  const { t, language } = useLanguage();
  const isRussian = language === 'ru';
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  
  // Admin states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Case studies state with database integration
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; action: string } | null>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Default case studies data - memoized to prevent recreation
  const defaultCaseStudies = useMemo((): CaseStudy[] => [
    {
      id: "telegram-bot",
      title: "Telegram Payment Bot",
      description: "Unified payment management in Telegram with Stripe, PayPal, and TBank integration.",
      descriptionRu: "Единое управление платежами в Telegram с интеграцией Stripe, PayPal и TBank.",
      icon: MessageSquare,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/TGpay.png",
      technologies: ["Stripe API", "PayPal SDK", "TBank API", "Telegram Bot API", "C# (.NET Core)", "ASP.NET"],
      fullDescription: "A comprehensive payment management solution integrated directly into Telegram, enabling businesses to handle multiple payment processors from a single interface. The bot automates payment processing, handles webhooks, and provides real-time transaction monitoring.",
      fullDescriptionRu: "Комплексное решение для управления платежами, интегрированное прямо в Telegram, позволяющее компаниям обрабатывать множественные платёжные системы из единого интерфейса. Бот автоматизирует обработку платежей, обрабатывает вебхуки и обеспечивает мониторинг транзакций в реальном времени.",
      uniqueFeatures: [
        "Everything in one place - unified dashboard",
        "Flexible setup with custom payment flows",
        "Multi-provider support (Stripe, PayPal, TBank)",
        "Real-time transaction monitoring"
      ],
      uniqueFeaturesRu: [
        "Всё в одном месте - единая панель управления",
        "Гибкая настройка с пользовательскими потоками платежей",
        "Поддержка нескольких провайдеров (Stripe, PayPal, TBank)",
        "Мониторинг транзакций в реальном времени"
      ],
      keyBenefits: [
        "Manager notifications for all transactions",
        "Complete interface customization",
        "Significant time-saving for financial operations",
        "Reduced payment processing errors"
      ],
      keyBenefitsRu: [
        "Уведомления менеджеров обо всех транзакциях",
        "Полная настройка интерфейса",
        "Значительная экономия времени в финансовых операциях",
        "Снижение ошибок в обработке платежей"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/TGpay.png",
        "https://images.unsplash.com/photo-1711344397160-b23d5deaa012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWxhdG9yJTIwZGFzaGJvYXJkJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc1OTU0NTU1OXww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Automation",
      industry: "FinTech",
      timeframe: "6 weeks",
      result: "85% reduction in payment processing time",
      showOnHomepage: true
    },
    {
      id: "bench-tournaments",
      title: "BenchTournaments",
      description: "Esports tournament automation platform with team registration, statistics, and prize distribution.",
      descriptionRu: "Платформа автоматизации киберспортивных турниров с регистрацией команд, статистикой и распределением призов.",
      icon: Trophy,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/BenchTournaments.png",
      technologies: ["Python", "Django", "MySQL", "Telegram Bot", "Discord Bot", "Bootstrap", "Linux VPS"],
      fullDescription: "A complete esports tournament management platform that automates the entire tournament lifecycle from team registration to prize distribution. The system handles player statistics, bracket generation, notifications, and automated payments.",
      fullDescriptionRu: "Полная платформа управления киберспортивными турнирами, которая автоматизирует весь жизненный цикл турнира от регистрации команд до распределения призов. Система обрабатывает статистику игроков, генерацию сеток, уведомления и автоматические выплаты.",
      uniqueFeatures: [
        "Full tournament automation from start to finish",
        "Automated bracket generation and management", 
        "Real-time statistics tracking",
        "Multi-platform notifications (Telegram + Discord)"
      ],
      uniqueFeaturesRu: [
        "Полная автоматизация турниров от начала до конца",
        "Автоматическая генерация и управление сетками",
        "Отслеживание статистики в реальном времени",
        "Многоплатформенные уведомления (Telegram + Discord)"
      ],
      keyBenefits: [
        "80-90% time savings for tournament organizers",
        "Error-free automated prize distribution",
        "95% participant satisfaction rate",
        "Streamlined registration and check-in process"
      ],
      keyBenefitsRu: [
        "80-90% экономия времени для организаторов турниров",
        "Безошибочное автоматическое распределение призов",
        "95% удовлетворённость участников",
        "Упрощённый процесс регистрации и поступления"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/BenchTournaments.png",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBwcm9kdWN0fGVufDF8fHx8MTc1OTU0NTU2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Web Development",
      industry: "Gaming & Esports",
      timeframe: "12 weeks",
      result: "90% automation of tournament processes",
      showOnHomepage: true
    },
    {
      id: "price-calculator",
      title: "Website Price Calculator",
      description: "Online calculator with automated pricing and sales integration features.",
      descriptionRu: "Онлайн-калькулятор с автоматизированным ценообразованием и интеграцией с продажами.",
      icon: Calculator,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/Webprice.png",
      technologies: ["Bolt AI", "JavaScript", "React", "API Integration", "Responsive Design"],
      fullDescription: "An intelligent pricing calculator that integrates seamlessly with websites to provide automated pricing for complex services. Uses AI to adapt pricing based on multiple variables and client requirements.",
      fullDescriptionRu: "Интеллектуальный калькулятор цен, который бесшовно интегрируется с веб-сайтами для автоматического ценообразования сложных услуг. Использует ИИ для адаптации цен на основе множественных переменных и требований клиентов.",
      uniqueFeatures: [
        "Seamless website integration",
        "AI-powered pricing optimization",
        "Easy configuration for sales teams",
        "Dynamic pricing based on multiple parameters"
      ],
      uniqueFeaturesRu: [
        "Бесшовная интеграция с веб-сайтом",
        "ИИ-оптимизация ценообразования",
        "Простая настройка для отделов продаж",
        "Динамическое ценообразование на основе множественных параметров"
      ],
      keyBenefits: [
        "Lightning-fast calculations for prospects",
        "Improved conversion rates",
        "Simplified client communication process",
        "Reduced sales cycle time"
      ],
      keyBenefitsRu: [
        "Молниеносные расчёты для потенциальных клиентов",
        "Улучшенные показатели конверсии",
        "Упрощённый процесс коммуникации с клиентами",
        "Сокращённое время цикла продаж"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/Webprice.png",
        "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "AI Solutions",
      industry: "Sales & Marketing",
      timeframe: "4 weeks",
      result: "45% increase in conversion rates",
      showOnHomepage: true
    },
    {
      id: "apg-ecosystem",
      title: "APG Eco System",
      description: "Business process automation platform reducing approval times from 35 to 5 days.",
      descriptionRu: "Платформа автоматизации бизнес-процессов, сокращающая время согласования с 35 до 5 дней.",
      icon: Cog,
      image: "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["Python", "Django", "MySQL", "Telegram Bot", "Google Sheets API", "Bootstrap", "RESTful APIs"],
      fullDescription: "A comprehensive business process automation platform that streamlines data collection, report verification, content publishing, and payroll management. The system dramatically reduces manual work and approval bottlenecks.",
      fullDescriptionRu: "Комплексная платформа автоматизации бизнес-процессов, которая оптимизирует сбор данных, проверку отчётов, публикацию контента и управление заработной платой. Система кардинально сокращает ручную работу и узкие места в согласовании.",
      uniqueFeatures: [
        "Reduces approval time from 35 to 5 days",
        "Automated routine process handling",
        "Google Sheets integration for data management",
        "Multi-departmental workflow automation"
      ],
      uniqueFeaturesRu: [
        "Сокращает время согласования с 35 до 5 дней",
        "Автоматическая обработка рутинных процессов",
        "Интеграция с Google Sheets для управления данными",
        "Многоотдельная автоматизация рабочих процессов"
      ],
      keyBenefits: [
        "Massive resource savings across departments",
        "Higher administrator motivation through automation",
        "Faster department collaboration and workflows",
        "Eliminated manual data entry errors"
      ],
      keyBenefitsRu: [
        "Массивная экономия ресурсов по всем отделам",
        "Повышенная мотивация администраторов через автоматизацию",
        "Более быстрое сотрудничество отделов и рабочие процессы",
        "Устранены ошибки ручного ввода данных"
      ],
      additionalImages: [
        "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBwcm9kdWN0fGVufDF8fHx8MTc1OTU0NTU2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Automation",
      industry: "Enterprise",
      timeframe: "16 weeks",
      result: "700% faster approval processes",
      showOnHomepage: true
    },
    {
      id: "ai-agents",
      title: "AI Agents for Business",
      description: "HR screening and chat moderation automation with 90%+ automation rate.",
      descriptionRu: "Автоматизация HR-скрининга и модерации чатов с уровнем автоматизации 90%+.",
      icon: Brain,
      image: "https://images.unsplash.com/photo-1745674684539-d90293d659a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["Python", "NLP (spaCy, transformers)", "Telegram API", "Vector Database", "ai.io.net", "Machine Learning"],
      fullDescription: "Advanced AI agents that handle chat moderation, automated HR screening, and hot topic analytics without human intervention. The system uses natural language processing and machine learning to make intelligent decisions.",
      fullDescriptionRu: "Продвинутые ИИ-агенты, которые обрабатывают модерацию чатов, автоматизированный HR-скрининг и аналитику горячих тем без вмешательства человека. Система использует обработку естественного языка и машинное обучение для принятия интеллектуальных решений.",
      uniqueFeatures: [
        "AI handles moderation without human intervention",
        "Automated HR candidate screening",
        "Hot topic analytics and trend detection",
        "Self-learning and improving algorithms"
      ],
      uniqueFeaturesRu: [
        "ИИ обрабатывает модерацию без вмешательства человека",
        "Автоматизированный скрининг HR-кандидатов",
        "Аналитика горячих тем и обнаружение трендов",
        "Самообучающиеся и совершенствующиеся алгоритмы"
      ],
      keyBenefits: [
        "90%+ automation rate for routine tasks",
        "HR time reduced from 20 to 3 hours per week",
        "65% increase in participant activity",
        "Consistent and unbiased decision making"
      ],
      keyBenefitsRu: [
        "90%+ уровень автоматизации для рутинных задач",
        "HR время сокращено с 20 до 3 часов в неделю",
        "65% увеличение активности участников",
        "Последовательное и беспристрастное принятие решений"
      ],
      additionalImages: [
        "https://images.unsplash.com/photo-1745674684539-d90293d659a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1644926054948-8c1155eeb0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxlZ3JhbSUyMGJvdCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NTk1NDU1NTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "AI Solutions",
      industry: "HR & Recruitment",
      timeframe: "10 weeks", 
      result: "90%+ task automation achieved",
      showOnHomepage: true
    },
    {
      id: "product-dashboard",
      title: "Product Dashboard",
      description: "Centralized analytics dashboard for courses and student data with flexible filtering.",
      descriptionRu: "Централизованная аналитическая панель для курсов и данных студентов с гибкой фильтрацией.",
      icon: BarChart,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/product.png",
      technologies: ["Flask", "Python", "SQLite", "Chart.js", "RESTful APIs", "Data Visualization"],
      fullDescription: "A comprehensive analytics dashboard that provides centralized course and student analytics with flexible interface designed specifically for business analysts. Features advanced filtering and data management capabilities.",
      fullDescriptionRu: "Комплексная аналитическая панель, которая предоставляет централизованную аналитику курсов и студентов с гибким интерфейсом, специально разработанным для бизнес-аналитиков. Включает продвинутые возможности фильтрации и управления данными.",
      uniqueFeatures: [
        "Flexible interface designed for analysts",
        "Easy data management and export",
        "Advanced filtering and search capabilities",
        "Real-time data synchronization"
      ],
      uniqueFeaturesRu: [
        "Гибкий интерфейс, разработанный для аналитиков",
        "Простое управление данными и экспорт",
        "Продвинутые возможности фильтрации и поиска",
        "Синхронизация данных в реальном времени"
      ],
      keyBenefits: [
        "Transparent analytics across all metrics",
        "Extensive filtering options for deep insights",
        "Faster analyst workflow and productivity",
        "Improved decision-making with clear data visualization"
      ],
      keyBenefitsRu: [
        "Прозрачная аналитика по всем метрикам",
        "Обширные возможности фильтрации для глубокого анализа",
        "Более быстрый рабочий процесс аналитиков и продуктивность",
        "Улучшенное принятие решений с ясной визуализацией данных"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/product.png",
        "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHx8MTc1OTU0NTU2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Analytics",
      industry: "Education",
      timeframe: "8 weeks",
      result: "60% faster data analysis workflows",
      showOnHomepage: true
    }
  ], []); // Empty dependency array since this data is static

  // Icon mapping for localStorage compatibility - moved outside component or memoized
  const iconMapping = useMemo(() => ({
    MessageSquare,
    Trophy,
    Calculator,
    Cog,
    Brain,
    BarChart,
    Rocket,
    Zap
  }), []);

  // Save to localStorage - memoized and debounced to prevent recreating on every render
  const saveToLocalStorage = useMemo(() => {
    return createDebouncedSave<CaseStudy[]>('allSolutions_cases', 100);
  }, []);

  // Helper function to prepare cases for storage
  const prepareCasesForStorage = useCallback((cases: CaseStudy[]) => {
    const casesToSave = cases.map(study => ({
      ...study,
      iconName: Object.keys(iconMapping).find(key => 
        iconMapping[key as keyof typeof iconMapping] === study.icon
      ) || 'MessageSquare'
    }));
    
    saveToLocalStorage(casesToSave);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('allSolutionsUpdated'));
  }, [iconMapping, saveToLocalStorage]);

  // Initialize data from database or use defaults
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      setIsLoading(true);
      try {
        if (!isMounted) return;
        
        // Try to load from database first
        const response = await caseStudiesApi.getAllCaseStudies();
        
        if (!isMounted) return;
        
        if (response.success && response.data && response.data.length > 0) {
          // Convert API case studies to component format
          const casesWithIcons = response.data.map((study: ApiCaseStudy) => ({
            ...study,
            icon: iconMapping[study.iconName as keyof typeof iconMapping] || MessageSquare
          }));
          setCaseStudies(casesWithIcons);
          console.log(`Loaded ${response.data.length} case studies from database`);
          
          // Show success notification for admins
          if (isAdminMode) {
            toast.success(`Successfully loaded ${response.data.length} case studies from database`);
          }
        } else {
          // Fallback to defaults and save them to database
          console.log('No case studies found in database, initializing with defaults...');
          setCaseStudies(defaultCaseStudies);
          prepareCasesForStorage(defaultCaseStudies);
          
          if (isAdminMode) {
            toast.info('Database empty - initialized with default case studies');
          }
          
          // Save defaults to database
          try {
            const defaultsForApi = defaultCaseStudies.map(study => ({
              ...study,
              iconName: Object.keys(iconMapping).find(key => 
                iconMapping[key as keyof typeof iconMapping] === study.icon
              ) || 'MessageSquare'
            }));
            
            await caseStudiesApi.bulkUpdateCaseStudies(defaultsForApi);
            console.log('Saved default case studies to database');
            
            if (isAdminMode) {
              toast.success('Default case studies saved to database');
            }
          } catch (saveError) {
            console.error('Error saving defaults to database:', saveError);
            if (isAdminMode) {
              toast.error('Failed to save defaults to database');
            }
          }
        }
      } catch (error) {
        console.error('Error loading case studies from database:', error);
        if (isMounted) {
          setCaseStudies(defaultCaseStudies);
          
          if (isAdminMode) {
            toast.warning('Database connection failed - using local storage');
          } else {
            toast.error('Ошибка загрузки данных из базы. Используются локальные данные.');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [iconMapping, defaultCaseStudies, prepareCasesForStorage, isAdminMode]);

  // Admin functions - memoized to prevent unnecessary re-renders
  const handleAdminLogin = useCallback(() => {
    if (adminCredentials.username === 'evavehvsa' && adminCredentials.password === 'neist0viik0nec') {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setShowAdminPanel(true);
      setAdminCredentials({ username: '', password: '' });
    } else {
      alert('Неверные учетные данные!');
    }
  }, [adminCredentials.username, adminCredentials.password]);

  const handleAdminLogout = useCallback(() => {
    setIsAdminMode(false);
    setShowAdminPanel(false);
    setEditingCase(null);
    setShowAddForm(false);
  }, []);

  const handleSaveCase = useCallback(async (caseData: Partial<CaseStudy>) => {
    // Check homepage limit before saving
    if (caseData.showOnHomepage) {
      const currentHomepageCount = caseStudies.filter(study => 
        study.showOnHomepage && (!editingCase || study.id !== editingCase.id)
      ).length;
      
      if (currentHomepageCount >= 6) {
        alert('Максимум 6 карточек можно отобразить на главной странице. Снимите галочку с другой карточки сначала.');
        return;
      }
    }
    
    setIsSaving(true);
    try {
      if (editingCase) {
        // Update existing case
        const caseForApi = {
          ...caseData,
          iconName: Object.keys(iconMapping).find(key => 
            iconMapping[key as keyof typeof iconMapping] === caseData.icon
          ) || 'MessageSquare'
        };
        
        const response = await caseStudiesApi.updateCaseStudy(editingCase.id, caseForApi);
        
        if (response.success && response.data) {
          const updatedCases = caseStudies.map(study => 
            study.id === editingCase.id ? { 
              ...response.data, 
              icon: iconMapping[response.data.iconName as keyof typeof iconMapping] || MessageSquare 
            } as CaseStudy : study
          );
          setCaseStudies(updatedCases);
          prepareCasesForStorage(updatedCases);
          toast.success('Кейс успешно обновлен в базе данных');
        } else {
          throw new Error(response.error || 'Ошибка обновления кейса');
        }
      } else {
        // Add new case
        const newCaseData = {
          ...caseData,
          iconName: Object.keys(iconMapping).find(key => 
            iconMapping[key as keyof typeof iconMapping] === caseData.icon
          ) || 'MessageSquare',
          additionalImages: caseData.additionalImages || []
        };
        
        const response = await caseStudiesApi.createCaseStudy(newCaseData);
        
        if (response.success && response.data) {
          const newCase = {
            ...response.data,
            icon: iconMapping[response.data.iconName as keyof typeof iconMapping] || MessageSquare
          } as CaseStudy;
          
          const updatedCases = [...caseStudies, newCase];
          setCaseStudies(updatedCases);
          prepareCasesForStorage(updatedCases);
          toast.success('Кейс успешно создан в базе данных');
        } else {
          throw new Error(response.error || 'Ошибка создания кейса');
        }
      }
      
      setEditingCase(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving case:', error);
      toast.error('Ошибка сохранения кейса: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setIsSaving(false);
    }
  }, [editingCase, caseStudies, prepareCasesForStorage]);

  const handleDeleteCase = useCallback(async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот кейс?')) {
      setIsSaving(true);
      try {
        const response = await caseStudiesApi.deleteCaseStudy(id);
        
        if (response.success) {
          const updatedCases = caseStudies.filter(study => study.id !== id);
          setCaseStudies(updatedCases);
          prepareCasesForStorage(updatedCases);
          toast.success('Кейс успешно удален из базы данных');
        } else {
          throw new Error(response.error || 'Ошибка удаления кейса');
        }
      } catch (error) {
        console.error('Error deleting case:', error);
        toast.error('Ошибка удаления кейса: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
      } finally {
        setIsSaving(false);
      }
    }
  }, [caseStudies, prepareCasesForStorage]);

  const handleToggleHomepage = useCallback(async (study: CaseStudy) => {
    // Check if we're trying to add to homepage and limit is reached
    if (!study.showOnHomepage) {
      const currentHomepageCount = caseStudies.filter(s => s.showOnHomepage && s.id !== study.id).length;
      if (currentHomepageCount >= 6) {
        alert('Максимум 6 карточек можно отобразить на главной странице. Сн�����мите галочку с другой карточки сначала.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const updatedCase = { ...study, showOnHomepage: !study.showOnHomepage };
      const caseForApi = {
        ...updatedCase,
        iconName: Object.keys(iconMapping).find(key => 
          iconMapping[key as keyof typeof iconMapping] === updatedCase.icon
        ) || 'MessageSquare'
      };
      
      const response = await caseStudiesApi.updateCaseStudy(study.id, caseForApi);
      
      if (response.success && response.data) {
        const updatedCases = caseStudies.map(s => 
          s.id === study.id ? { 
            ...response.data, 
            icon: iconMapping[response.data.iconName as keyof typeof iconMapping] || MessageSquare 
          } as CaseStudy : s
        );
        setCaseStudies(updatedCases);
        prepareCasesForStorage(updatedCases);
        toast.success(updatedCase.showOnHomepage ? 'Кейс добавлен на главную страницу' : 'Кейс убран с главной страницы');
      } else {
        throw new Error(response.error || 'Ошибка обновления кейса');
      }
    } catch (error) {
      console.error('Error toggling homepage:', error);
      toast.error('Ошибка обновления: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setIsSaving(false);
    }
  }, [caseStudies, prepareCasesForStorage]);

  // Database synchronization function
  const handleDatabaseSync = useCallback(async () => {
    setShowSyncModal(true);
    setIsSaving(true);
    
    try {
      const sync = new CaseStudiesSync(iconMapping);
      
      const result = await sync.autoSync({
        onProgress: setSyncProgress,
        onError: (error) => {
          console.error('Sync error:', error);
          toast.error(error);
        },
        onSuccess: (message) => {
          console.log('Sync success:', message);
          toast.success(message);
        }
      });
      
      // Update local state with synced data
      setCaseStudies(result.cases);
      prepareCasesForStorage(result.cases);
      
      // Show sync result
      const directionText = {
        'toDb': isRussian ? 'Локальные данные отправлены в базу' : 'Local data uploaded to database',
        'fromDb': isRussian ? 'Данные загружены из базы' : 'Data downloaded from database', 
        'local': isRussian ? 'Используются локальные данные' : 'Using local data'
      };
      
      toast.success(directionText[result.direction as keyof typeof directionText] || 'Sync completed');
      
    } catch (error) {
      console.error('Database sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(isRussian ? `Ошибка синхронизации: ${errorMessage}` : `Sync failed: ${errorMessage}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setShowSyncModal(false);
        setSyncProgress(null);
      }, 1500);
    }
  }, [iconMapping, prepareCasesForStorage, isRussian]);

  const categories = ["All", "Automation", "AI Solutions", "Analytics", "Web Development"];
  const industries = ["All", "FinTech", "Gaming & Esports", "Sales & Marketing", "Enterprise", "HR & Recruitment", "Education"];

  const filteredCases = useMemo(() => {
    return caseStudies.filter(study => {
      const matchesSearch = searchTerm === "" || 
        study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (study.descriptionRu && study.descriptionRu.toLowerCase().includes(searchTerm.toLowerCase())) ||
        study.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || study.category === selectedCategory;
      const matchesIndustry = selectedIndustry === "All" || study.industry === selectedIndustry;
      
      return matchesSearch && matchesCategory && matchesIndustry;
    });
  }, [caseStudies, searchTerm, selectedCategory, selectedIndustry]);

  const openModal = useCallback((study: CaseStudy) => {
    setSelectedCase(study);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelectedCase(null);
    document.body.style.overflow = "unset";
  }, []);

  const handleGetStarted = useCallback(() => {
    closeModal();
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        onOpenModal();
      }, 300);
    }, 150);
  }, [closeModal, onClose, onOpenModal]);

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
                  texts={[t('allsolutions.title'), "Rocket Tech Solution"]} 
                  speed={100}
                  pauseDuration={3000}
                  className="min-w-[200px] text-xl font-bold"
                />
              </div>
            </div>
            
            {/* Right - Language Switcher and Admin */}
            <div className="flex items-center space-x-3">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Admin Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="p-2 text-gray-400 hover:text-[#51508E] hover:bg-[#BBFF2C]/10 transition-colors"
                title="Administrator"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Admin Mode Indicator */}
              {isAdminMode && (
                <div className="flex items-center space-x-2">
                  <Badge className="bg-[#FC2D00] text-white text-xs">Admin Mode</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAdminLogout}
                    className="text-xs text-[#FC2D00] hover:bg-[#FC2D00]/10"
                  >
                    Logout
                  </Button>
                </div>
              )}
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
              <span className="text-[#BBFF2C] font-medium">{t('allsolutions.badge')}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8">
              {t('allsolutions.hero.title-1')}
              <span className="block text-[#BBFF2C]">{t('allsolutions.hero.title-2')}</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              {t('allsolutions.hero.description')}
            </p>

            {/* Work in Progress Notice */}
            <div className="inline-flex items-center px-6 py-3 rounded-lg bg-[#FC2D00]/10 border border-[#FC2D00]/20 mb-12 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#FC2D00] rounded-full animate-pulse"></div>
                <span className="text-[#FC2D00] font-medium">
                  {isRussian ? 'Раздел активно заполняется новыми кейсами' : 'Section is actively being filled with new case studies'}
                </span>
                <div className="w-2 h-2 bg-[#FC2D00] rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#BBFF2C]">{caseStudies.length}</div>
                <p className="text-sm text-gray-300">{t('allsolutions.stats.total')}</p>
              </div>
              {isAdminMode && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#BBFF2C]">
                    {caseStudies.filter(s => s.showOnHomepage).length}/6
                  </div>
                  <p className="text-sm text-gray-300">{t('allsolutions.stats.homepage')}</p>
                </div>
              )}
              <div className="text-center">
                <div className="text-3xl font-bold text-[#7B93FF]">{categories.length - 1}</div>
                <p className="text-sm text-gray-300">{t('allsolutions.stats.categories')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FFC6F2]">{industries.length - 1}</div>
                <p className="text-sm text-gray-300">{t('allsolutions.stats.industries')}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FC2D00]">95%</div>
                <p className="text-sm text-gray-300">{t('allsolutions.stats.success')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('allsolutions.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-[#BBFF2C] focus:ring-[#BBFF2C]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md focus:border-[#BBFF2C] focus:ring-[#BBFF2C] focus:ring-1"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md focus:border-[#BBFF2C] focus:ring-[#BBFF2C] focus:ring-1"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== "All" || selectedIndustry !== "All") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedIndustry("All");
                }}
                className="text-gray-600 hover:text-[#040725]"
              >
{t('allsolutions.clear-filters')}
              </Button>
            )}

            {/* Admin Buttons */}
            {isAdminMode && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowAddForm(true)}
                  disabled={isSaving || isLoading}
                  className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Solution
                </Button>
                
                <Button
                  onClick={() => handleDatabaseSync()}
                  disabled={isSaving || isLoading}
                  variant="outline"
                  className="border-[#040725] text-[#040725] hover:bg-[#040725] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Sync DB
                </Button>
              </div>
            )}
          </div>

          {/* Results Count & Admin Tips */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-gray-600">
              Showing {filteredCases.length} of {caseStudies.length} {t('allsolutions.results')}
            </div>
            {isAdminMode && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Home className="w-3 h-3 text-[#BBFF2C]" />
                  <span>Click home icon to toggle homepage display</span>
                </div>
                <QuietHealthMonitor />
              </div>
            )}
          </div>
          
          {/* Admin Sync Status Panel */}
          {isAdminMode && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 max-w-7xl">
              <SyncStatus 
                iconMapping={iconMapping}
                onSyncTrigger={handleDatabaseSync}
                isLoading={isSaving || isLoading}
              />
              <DbOperationsLog 
                maxOperations={5}
                autoRefresh={true}
                refreshInterval={5000}
              />
              <HealthCheck 
                showDetails={true}
                autoRefresh={isAdminMode}
                refreshInterval={300000}
              />
              <SystemStatus 
                showDetailed={true}
                autoRefresh={isAdminMode}
              />
            </div>
          )}
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-[#BBFF2C] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#040725] font-medium">
                {isRussian ? 'Загрузка кейсов из базы данных...' : 'Loading case studies from database...'}
              </p>
            </div>
          )}
          
          {/* Saving State Overlay */}
          {isSaving && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 shadow-xl flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-[#BBFF2C] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[#040725] font-medium">
                  {isRussian ? 'Сохранение в базу данных...' : 'Saving to database...'}
                </span>
              </div>
            </div>
          )}
          
          {!isLoading && filteredCases.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCases.map((study) => (
                <div
                  key={study.id}
                  className="group cursor-pointer transition-all duration-300 hover:-translate-y-2"
                  onClick={() => openModal(study)}
                >
                  <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-[420px] group-hover:shadow-2xl group-hover:shadow-[#BBFF2C]/20">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={study.image}
                          alt={study.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040725]/60 via-transparent to-transparent"></div>

                        {/* Icon */}
                        <div className="absolute top-4 left-4">
                          <div className="w-12 h-12 bg-[#BBFF2C] rounded-lg flex items-center justify-center shadow-lg">
                            <study.icon className="w-6 h-6 text-[#040725]" />
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 right-4 flex flex-col space-y-2">
                          <Badge className="bg-[#040725]/80 text-white text-xs">
                            {study.category}
                          </Badge>
                          {/* Homepage Indicator - Only visible in admin mode */}
                          {isAdminMode && study.showOnHomepage && (
                            <Badge className="bg-[#BBFF2C]/90 text-[#040725] text-xs flex items-center space-x-1">
                              <Home className="w-3 h-3" />
                              <span>Homepage</span>
                            </Badge>
                          )}
                        </div>
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
                            {t('allsolutions.view-details')}
                          </span>
                          <div className="flex items-center space-x-2">
                            {isAdminMode && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleHomepage(study);
                                  }}
                                  className={`p-1 transition-colors ${
                                    study.showOnHomepage 
                                      ? 'text-[#BBFF2C] hover:text-[#a3e024]' 
                                      : 'text-gray-400 hover:text-[#BBFF2C]'
                                  }`}
                                  title={study.showOnHomepage ? 'Remove from homepage' : 'Add to homepage'}
                                >
                                  <Home className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCase(study);
                                    setShowAddForm(true);
                                  }}
                                  className="p-1 text-gray-400 hover:text-[#51508E] transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCase(study.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-[#FC2D00] transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <ExternalLink className="w-4 h-4 text-[#51508E] group-hover:text-[#BBFF2C] transition-colors" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('allsolutions.no-results.title')}</h3>
              <p className="text-gray-600 mb-6">
                {t('allsolutions.no-results.description')}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedIndustry("All");
                }}
                variant="outline"
                className="border-[#BBFF2C] text-[#BBFF2C] hover:bg-[#BBFF2C] hover:text-[#040725]"
              >
                {t('allsolutions.no-results.button')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Case Study Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#BBFF2C] rounded-lg flex items-center justify-center">
                  <selectedCase.icon className="w-6 h-6 text-[#040725]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#040725]">{selectedCase.title}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge className="bg-[#040725] text-white text-xs">
                      {selectedCase.category}
                    </Badge>
                    <span className="text-sm text-gray-600">{selectedCase.industry}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Hero Image */}
              <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={selectedCase.image}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040725]/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="text-sm opacity-90">Project Duration</div>
                      <div className="font-semibold">{selectedCase.timeframe}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90">Key Result</div>
                      <div className="font-semibold">{selectedCase.result}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#040725] mb-4">Project Overview</h3>
                <p className="text-gray-600 leading-relaxed">
                  {getLocalizedText(selectedCase.fullDescription, selectedCase.fullDescriptionRu, isRussian)}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Cog className="w-5 h-5 text-[#51508E]" />
                  <h4 className="font-bold text-[#040725]">Technologies Used</h4>
                </div>
                <div className="space-y-2">
                  {selectedCase.technologies.map((tech, idx) => (
                    <Badge
                      key={`${selectedCase.id}-modal-tech-${idx}`}
                      variant="outline"
                      className="block w-fit border-[#D2D0F7] text-[#51508E]"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Unique Features */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-5 h-5 text-[#7B93FF]" />
                    <h4 className="font-bold text-[#040725]">Unique Features</h4>
                  </div>
                  <ul className="space-y-2">
                    {getLocalizedArray(selectedCase.uniqueFeatures, selectedCase.uniqueFeaturesRu, isRussian).map((feature, idx) => (
                      <li
                        key={`${selectedCase.id}-feature-${idx}`}
                        className="flex items-start space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#7B93FF] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Benefits */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BarChart className="w-5 h-5 text-[#FFC6F2]" />
                    <h4 className="font-bold text-[#040725]">Key Benefits</h4>
                  </div>
                  <ul className="space-y-2">
                    {getLocalizedArray(selectedCase.keyBenefits, selectedCase.keyBenefitsRu, isRussian).map((benefit, idx) => (
                      <li
                        key={`${selectedCase.id}-benefit-${idx}`}
                        className="flex items-start space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#FFC6F2] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-[#51508E]/10 to-[#7B93FF]/10 rounded-lg p-6 border border-[#51508E]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#040725] mb-1">
                        {t('allsolutions.modal.ready')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('allsolutions.modal.description')}
                      </p>
                    </div>
                    <Button
                      onClick={handleGetStarted}
                      className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024] border-0"
                    >
                      {t('allsolutions.get-started')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAdminLogin(false)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#040725]">Administrator Login</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminLogin(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleAdminLogin}
                className="w-full bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024]"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Form Modal */}
      {showAddForm && (
        <AdminFormModal
          editingCase={editingCase}
          onSave={handleSaveCase}
          onClose={() => {
            setShowAddForm(false);
            setEditingCase(null);
          }}
          categories={categories.filter(c => c !== "All")}
          industries={industries.filter(i => i !== "All")}
          iconMapping={iconMapping}
          caseStudies={caseStudies}
        />
      )}
      
      {/* Database Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md mx-4 min-w-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#BBFF2C] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-[#040725] animate-bounce" />
              </div>
              
              <h3 className="text-xl font-bold text-[#040725] mb-2">
                {isRussian ? 'Синхронизация с базой данных' : 'Database Synchronization'}
              </h3>
              
              {syncProgress && (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {syncProgress.action}
                  </p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#BBFF2C] h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {syncProgress.current} / {syncProgress.total}
                  </p>
                </div>
              )}
              
              {!syncProgress && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 border-2 border-[#BBFF2C] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[#040725]">
                    {isRussian ? 'Инициализация...' : 'Initializing...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

// Admin Form Modal Component
interface AdminFormModalProps {
  editingCase: CaseStudy | null;
  onSave: (data: Partial<CaseStudy>) => void;
  onClose: () => void;
  categories: string[];
  industries: string[];
  iconMapping: Record<string, React.ComponentType<any>>;
  caseStudies: CaseStudy[];
}

const AdminFormModal = React.memo(function AdminFormModal({ editingCase, onSave, onClose, categories, industries, iconMapping, caseStudies }: AdminFormModalProps) {
  const [formData, setFormData] = useState({
    title: editingCase?.title || '',
    description: editingCase?.description || '',
    descriptionRu: editingCase?.descriptionRu || '',
    fullDescription: editingCase?.fullDescription || '',
    fullDescriptionRu: editingCase?.fullDescriptionRu || '',
    category: editingCase?.category || categories[0],
    industry: editingCase?.industry || industries[0],
    timeframe: editingCase?.timeframe || '',
    result: editingCase?.result || '',
    image: editingCase?.image || '',
    technologies: editingCase?.technologies?.join(', ') || '',
    uniqueFeatures: editingCase?.uniqueFeatures?.join('\n') || '',
    uniqueFeaturesRu: editingCase?.uniqueFeaturesRu?.join('\n') || '',
    keyBenefits: editingCase?.keyBenefits?.join('\n') || '',
    keyBenefitsRu: editingCase?.keyBenefitsRu?.join('\n') || '',
    iconName: editingCase ? Object.keys(iconMapping).find(key => 
      iconMapping[key] === editingCase.icon
    ) || 'MessageSquare' : 'MessageSquare',
    showOnHomepage: editingCase?.showOnHomepage || false
  });

  const updateFormField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      icon: iconMapping[formData.iconName as keyof typeof iconMapping],
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      uniqueFeatures: formData.uniqueFeatures.split('\n').filter(Boolean),
      uniqueFeaturesRu: formData.uniqueFeaturesRu ? formData.uniqueFeaturesRu.split('\n').filter(Boolean) : undefined,
      keyBenefits: formData.keyBenefits.split('\n').filter(Boolean),
      keyBenefitsRu: formData.keyBenefitsRu ? formData.keyBenefitsRu.split('\n').filter(Boolean) : undefined,
      additionalImages: [formData.image] // Simple implementation
    };
    
    onSave(submitData);
  }, [formData, iconMapping, onSave]);

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-[#040725]">
            {editingCase ? 'Edit Solution' : 'Add New Solution'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Info Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Многоязычная поддержка</p>
                <p>Russian fields are optional. When Russian language is selected, these fields will be displayed instead of English ones. If Russian fields are empty, English text will be shown as fallback.</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select value={formData.iconName} onValueChange={(value) => setFormData(prev => ({ ...prev, iconName: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(iconMapping).map(iconName => (
                      <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Input
                  id="timeframe"
                  value={formData.timeframe}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                  placeholder="e.g., 8 weeks"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="result">Key Result</Label>
                <Input
                  id="result"
                  value={formData.result}
                  onChange={(e) => setFormData(prev => ({ ...prev, result: e.target.value }))}
                  placeholder="e.g., 60% faster workflows"
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* Show on Homepage Checkbox */}
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox 
                id="showOnHomepage"
                checked={formData.showOnHomepage}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showOnHomepage: !!checked }))}
              />
              <div className="flex flex-col">
                <Label htmlFor="showOnHomepage" className="text-sm font-medium">
                  Show on Homepage
                </Label>
                <p className="text-xs text-gray-600">
                  Display this solution in the "Launch Pad - Our Solutions" section (max 6 solutions)
                  <br />
                  <span className="text-[#040725] font-medium">
                    Currently showing: {caseStudies.filter(c => c.showOnHomepage).length}/6 solutions
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={2}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="descriptionRu">Short Description (Russian)</Label>
              <Textarea
                id="descriptionRu"
                value={formData.descriptionRu}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionRu: e.target.value }))}
                rows={2}
                className="mt-1"
                placeholder="Краткое описание на русском языке (опционально)"
              />
            </div>
            
            <div>
              <Label htmlFor="fullDescription">Full Description *</Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                required
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="fullDescriptionRu">Full Description (Russian)</Label>
              <Textarea
                id="fullDescriptionRu"
                value={formData.fullDescriptionRu}
                onChange={(e) => setFormData(prev => ({ ...prev, fullDescriptionRu: e.target.value }))}
                rows={4}
                className="mt-1"
                placeholder="Полное описание на русском языке (опционально)"
              />
            </div>
            
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                placeholder="React, Node.js, MongoDB"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="uniqueFeatures">Unique Features (one per line)</Label>
              <Textarea
                id="uniqueFeatures"
                value={formData.uniqueFeatures}
                onChange={(e) => setFormData(prev => ({ ...prev, uniqueFeatures: e.target.value }))}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="uniqueFeaturesRu">Unique Features (Russian - one per line)</Label>
              <Textarea
                id="uniqueFeaturesRu"
                value={formData.uniqueFeaturesRu}
                onChange={(e) => setFormData(prev => ({ ...prev, uniqueFeaturesRu: e.target.value }))}
                rows={4}
                className="mt-1"
                placeholder="Уникальные особенности на русском языке (опционально)"
              />
            </div>
            
            <div>
              <Label htmlFor="keyBenefits">Key Benefits (one per line)</Label>
              <Textarea
                id="keyBenefits"
                value={formData.keyBenefits}
                onChange={(e) => setFormData(prev => ({ ...prev, keyBenefits: e.target.value }))}
                rows={4}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="keyBenefitsRu">Key Benefits (Russian - one per line)</Label>
              <Textarea
                id="keyBenefitsRu"
                value={formData.keyBenefitsRu}
                onChange={(e) => setFormData(prev => ({ ...prev, keyBenefitsRu: e.target.value }))}
                rows={4}
                className="mt-1"
                placeholder="Ключевые преимущества на русском языке (опционально)"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#BBFF2C] text-[#040725] hover:bg-[#a3e024]"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingCase ? 'Update Solution' : 'Add Solution'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

// Export async function to get homepage solutions from database
export async function getHomepageSolutionsFromDb(): Promise<CaseStudy[]> {
  try {
    const response = await caseStudiesApi.getAllCaseStudies();
    
    if (response.success && response.data && Array.isArray(response.data)) {
      const iconMapping = {
        MessageSquare,
        Trophy,
        Calculator,
        Cog,
        Brain,
        BarChart,
        Rocket,
        Zap
      };
      
      const casesWithIcons = response.data
        .filter((study: ApiCaseStudy) => {
          return study && 
                 typeof study === 'object' && 
                 study.id && 
                 study.title && 
                 study.description;
        })
        .map((study: ApiCaseStudy) => ({
          ...study,
          icon: iconMapping[study.iconName as keyof typeof iconMapping] || MessageSquare,
          showOnHomepage: Boolean(study.showOnHomepage)
        }))
        .filter((study: CaseStudy) => study.showOnHomepage === true)
        .sort((a: CaseStudy, b: CaseStudy) => {
          return (a.id || '').localeCompare(b.id || '');
        })
        .slice(0, 6);
      
      console.log(`Loaded ${casesWithIcons.length} homepage solutions from database`);
      return casesWithIcons;
    }
  } catch (error) {
    console.error('Error loading homepage solutions from database:', error);
  }
  
  // Fallback to localStorage function
  return getHomepageSolutions();
}

// Export function to get homepage solutions from localStorage (fallback)
export function getHomepageSolutions(): CaseStudy[] {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage not available');
      return [];
    }

    const savedCases = localStorage.getItem('allSolutions_cases');
    if (savedCases && savedCases.trim() !== '') {
      const parsedCases = JSON.parse(savedCases);
      if (!Array.isArray(parsedCases)) {
        console.warn('Homepage solutions data is not an array');
        return [];
      }
      
      const iconMapping = {
        MessageSquare,
        Trophy,
        Calculator,
        Cog,
        Brain,
        BarChart,
        Rocket,
        Zap
      };
      
      const casesWithIcons = parsedCases
        .filter((study: any) => {
          // More robust validation
          return study && 
                 typeof study === 'object' && 
                 study.id && 
                 study.title && 
                 study.description;
        })
        .map((study: any) => ({
          ...study,
          icon: iconMapping[study.iconName as keyof typeof iconMapping] || MessageSquare,
          showOnHomepage: Boolean(study.showOnHomepage) // Ensure boolean
        }))
        .filter((study: CaseStudy) => study.showOnHomepage === true)
        .sort((a: CaseStudy, b: CaseStudy) => {
          // Sort by id to maintain consistent order (newer cases have higher timestamp ids)
          return (a.id || '').localeCompare(b.id || '');
        })
        .slice(0, 6); // Limit to 6 cards max
      
      return casesWithIcons;
    }
  } catch (error) {
    console.error('Error loading homepage solutions:', error);
    // More specific error handling
    if (error instanceof SyntaxError) {
      console.error('JSON parse error - localStorage data may be corrupted');
      // Optionally clear corrupted data
      try {
        localStorage.removeItem('allSolutions_cases');
      } catch (e) {
        console.error('Could not clear corrupted localStorage data');
      }
    }
  }
  
  // Return default homepage solutions if no data in localStorage
  const defaultHomepageSolutions = [
    {
      id: "telegram-bot",
      title: "Telegram Payment Bot",
      description: "Unified payment management in Telegram with Stripe, PayPal, and TBank integration.",
      descriptionRu: "Единое управление платежами в Telegram с интеграцией Stripe, PayPal и TBank.",
      icon: MessageSquare,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/TGpay.png",
      technologies: ["Stripe API", "PayPal SDK", "TBank API", "Telegram Bot API", "C# (.NET Core)", "ASP.NET"],
      fullDescription: "A comprehensive payment management solution integrated directly into Telegram, enabling businesses to handle multiple payment processors from a single interface. The bot automates payment processing, handles webhooks, and provides real-time transaction monitoring.",
      fullDescriptionRu: "Комплексное решение для управления платежами, интегрированное прямо в Telegram, позволяющее компаниям обрабатывать множественные платёжные системы из единого интерфейса. Бот автоматизирует обработку платежей, обрабатывает вебхуки и обеспечивает мониторинг транзакций в реальном времени.",
      uniqueFeatures: [
        "Everything in one place - unified dashboard",
        "Flexible setup with custom payment flows",
        "Multi-provider support (Stripe, PayPal, TBank)",
        "Real-time transaction monitoring"
      ],
      uniqueFeaturesRu: [
        "Всё в одном месте - единая панель управления",
        "Гибкая настройка с пользовательскими потоками платежей",
        "Поддержка нескольких провайдеров (Stripe, PayPal, TBank)",
        "Мониторинг транзакций в реальном времени"
      ],
      keyBenefits: [
        "Manager notifications for all transactions",
        "Complete interface customization",
        "Significant time-saving for financial operations",
        "Reduced payment processing errors"
      ],
      keyBenefitsRu: [
        "Уведомления менеджеров обо всех транзакциях",
        "Полная настройка интерфейса",
        "Значительная экономия времени в финансовых операциях",
        "Снижение ошибок в обработке платежей"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/TGpay.png",
        "https://images.unsplash.com/photo-1711344397160-b23d5deaa012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxjdWxhdG9yJTIwZGFzaGJvYXJkJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc1OTU0NTU1OXww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Automation",
      industry: "FinTech",
      timeframe: "6 weeks",
      result: "85% reduction in payment processing time",
      showOnHomepage: true
    },
    {
      id: "bench-tournaments",
      title: "BenchTournaments",
      description: "Esports tournament automation platform with team registration, statistics, and prize distribution.",
      descriptionRu: "Платформа автоматизации киберспортивных турниров с регистрацией команд, статистикой и распределением призов.",
      icon: Trophy,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/BenchTournaments.png",
      technologies: ["Python", "Django", "MySQL", "Telegram Bot", "Discord Bot", "Bootstrap", "Linux VPS"],
      fullDescription: "A complete esports tournament management platform that automates the entire tournament lifecycle from team registration to prize distribution. The system handles player statistics, bracket generation, notifications, and automated payments.",
      fullDescriptionRu: "Полная платформа управления киберспортивными турнирами, которая автоматизирует весь жизненный цикл турнира от регистрации команд до распределения призов. Система обрабатывает статистику игроков, генерацию сеток, уведомления и автоматические выплаты.",
      uniqueFeatures: [
        "Full tournament automation from start to finish",
        "Automated bracket generation and management", 
        "Real-time statistics tracking",
        "Multi-platform notifications (Telegram + Discord)"
      ],
      uniqueFeaturesRu: [
        "Полная автоматизация турниров от начала до конца",
        "Автоматическая генерация и управление сетками",
        "Отслеживание статистики в реальном времени",
        "Многоплатформенные уведомления (Telegram + Discord)"
      ],
      keyBenefits: [
        "80-90% time savings for tournament organizers",
        "Error-free automated prize distribution",
        "95% participant satisfaction rate",
        "Streamlined registration and check-in process"
      ],
      keyBenefitsRu: [
        "80-90% экономия времени для организаторов турниров",
        "Безошибочное автоматическое распределение призов",
        "95% удовлетворённость участников",
        "Упрощённый процесс регистрации и поступления"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/BenchTournaments.png",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBwcm9kdWN0fGVufDF8fHx8MTc1OTU0NTU2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Web Development",
      industry: "Gaming & Esports",
      timeframe: "12 weeks",
      result: "90% automation of tournament processes",
      showOnHomepage: true
    },
    {
      id: "price-calculator",
      title: "Website Price Calculator",
      description: "Online calculator with automated pricing and sales integration features.",
      descriptionRu: "Онлайн-калькулятор с автоматизированным ценообразованием и интеграцией с продажами.",
      icon: Calculator,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/Webprice.png",
      technologies: ["Bolt AI", "JavaScript", "React", "API Integration", "Responsive Design"],
      fullDescription: "An intelligent pricing calculator that integrates seamlessly with websites to provide automated pricing for complex services. Uses AI to adapt pricing based on multiple variables and client requirements.",
      fullDescriptionRu: "Интеллектуальный калькулятор цен, который бесшовно интегрируется с веб-сайтами для автоматического ценообразования сложных услуг. Использует ИИ для адаптации цен на основе множественных переменных и требований клиентов.",
      uniqueFeatures: [
        "Seamless website integration",
        "AI-powered pricing optimization",
        "Easy configuration for sales teams",
        "Dynamic pricing based on multiple parameters"
      ],
      uniqueFeaturesRu: [
        "Бесшовная интеграция с веб-сайтом",
        "ИИ-оптимизация ценообразования",
        "Простая настройка для отделов продаж",
        "Динамическое ценообразование на основе множественных параметров"
      ],
      keyBenefits: [
        "Lightning-fast calculations for prospects",
        "Improved conversion rates",
        "Simplified client communication process",
        "Reduced sales cycle time"
      ],
      keyBenefitsRu: [
        "Молниеносные расчёты для потенциальных клиентов",
        "Улучшенные показатели конверсии",
        "Упрощённый процесс коммуникации с клиентами",
        "Сокращённое время цикла продаж"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/Webprice.png",
        "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "AI Solutions",
      industry: "Sales & Marketing",
      timeframe: "4 weeks",
      result: "45% increase in conversion rates",
      showOnHomepage: true
    },
    {
      id: "apg-ecosystem",
      title: "APG Eco System",
      description: "Business process automation platform reducing approval times from 35 to 5 days.",
      descriptionRu: "Платформа автоматизации бизнес-процессов, сокращающая время согласования с 35 до 5 дней.",
      icon: Cog,
      image: "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["Python", "Django", "MySQL", "Telegram Bot", "Google Sheets API", "Bootstrap", "RESTful APIs"],
      fullDescription: "A comprehensive business process automation platform that streamlines data collection, report verification, content publishing, and payroll management. The system dramatically reduces manual work and approval bottlenecks.",
      fullDescriptionRu: "Комплексная платформа автоматизации бизнес-процессов, которая оптимизирует сбор данных, проверку отчётов, публикацию контента и управление заработной платой. Система кардинально сокращает ручную работу и узкие места в согласовании.",
      uniqueFeatures: [
        "Reduces approval time from 35 to 5 days",
        "Automated routine process handling",
        "Google Sheets integration for data management",
        "Multi-departmental workflow automation"
      ],
      uniqueFeaturesRu: [
        "Сокращает время согласования с 35 до 5 дней",
        "Автоматическая обработка рутинных процессов",
        "Интеграция с Google Sheets для управления данными",
        "Многоотдельная автоматизация рабочих процессов"
      ],
      keyBenefits: [
        "Massive resource savings across departments",
        "Higher administrator motivation through automation",
        "Faster department collaboration and workflows",
        "Eliminated manual data entry errors"
      ],
      keyBenefitsRu: [
        "Массивная экономия ресурсов по всем отделам",
        "Повышенная мотивация администраторов через автоматизацию",
        "Более быстрое сотрудничество отделов и рабочие процессы",
        "Устранены ошибки ручного ввода данных"
      ],
      additionalImages: [
        "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBwcm9kdWN0fGVufDF8fHx8MTc1OTU0NTU2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Automation",
      industry: "Enterprise",
      timeframe: "16 weeks",
      result: "700% faster approval processes",
      showOnHomepage: true
    },
    {
      id: "ai-agents",
      title: "AI Agents for Business",
      description: "HR screening and chat moderation automation with 90%+ automation rate.",
      descriptionRu: "Автоматизация HR-скрининга и модерации чатов с уровнем автоматизации 90%+.",
      icon: Brain,
      image: "https://images.unsplash.com/photo-1745674684539-d90293d659a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      technologies: ["Python", "NLP (spaCy, transformers)", "Telegram API", "Vector Database", "ai.io.net", "Machine Learning"],
      fullDescription: "Advanced AI agents that handle chat moderation, automated HR screening, and hot topic analytics without human intervention. The system uses natural language processing and machine learning to make intelligent decisions.",
      fullDescriptionRu: "Продвинутые ИИ-агенты, которые обрабатывают модерацию чатов, автоматизированный HR-скрининг и аналитику горячих тем без вмешательства человека. Система использует обработку естественного языка и машинное обучение для принятия интеллектуальных решений.",
      uniqueFeatures: [
        "AI handles moderation without human intervention",
        "Automated HR candidate screening",
        "Hot topic analytics and trend detection",
        "Self-learning and improving algorithms"
      ],
      uniqueFeaturesRu: [
        "ИИ обрабатывает модерацию без вмешательства человека",
        "Автоматизированный скрининг HR-кандидатов",
        "Аналитика горячих тем и обнаружение трендов",
        "Самообучающиеся и совершенствующиеся алгоритмы"
      ],
      keyBenefits: [
        "90%+ automation rate for routine tasks",
        "HR time reduced from 20 to 3 hours per week",
        "65% increase in participant activity",
        "Consistent and unbiased decision making"
      ],
      keyBenefitsRu: [
        "90%+ уровень автоматизации для рутинных задач",
        "HR время сокращено с 20 до 3 часов в неделю",
        "65% увеличение активности участников",
        "Последовательное и беспристрастное принятие решений"
      ],
      additionalImages: [
        "https://images.unsplash.com/photo-1745674684539-d90293d659a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBSSUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2V8ZW58MXx8fHwxNzU5NTQ1NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1644926054948-8c1155eeb0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxlZ3JhbSUyMGJvdCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NTk1NDU1NTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "AI Solutions",
      industry: "HR & Recruitment",
      timeframe: "10 weeks", 
      result: "90%+ task automation achieved",
      showOnHomepage: true
    },
    {
      id: "product-dashboard",
      title: "Product Dashboard",
      description: "Centralized analytics dashboard for courses and student data with flexible filtering.",
      descriptionRu: "Централизованная аналитическая панель для курсов и данных студентов с гибкой фильтрацией.",
      icon: BarChart,
      image: "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/product.png",
      technologies: ["Flask", "Python", "SQLite", "Chart.js", "RESTful APIs", "Data Visualization"],
      fullDescription: "A comprehensive analytics dashboard that provides centralized course and student analytics with flexible interface designed specifically for business analysts. Features advanced filtering and data management capabilities.",
      fullDescriptionRu: "Комплексная аналитическая панель, которая предоставляет централизованную аналитику курсов и студентов с гибким интерфейсом, специально разработанным для бизнес-аналитиков. Включает продвинутые возможности фильтрации и управления данными.",
      uniqueFeatures: [
        "Flexible interface designed for analysts",
        "Easy data management and export",
        "Advanced filtering and search capabilities",
        "Real-time data synchronization"
      ],
      uniqueFeaturesRu: [
        "Гибкий интерфейс, разработанный для аналитиков",
        "Простое управление данными и экспорт",
        "Продвинутые возможности фильтрации и поиска",
        "Синхронизация данных в реальном времени"
      ],
      keyBenefits: [
        "Transparent analytics across all metrics",
        "Extensive filtering options for deep insights",
        "Faster analyst workflow and productivity",
        "Improved decision-making with clear data visualization"
      ],
      keyBenefitsRu: [
        "Прозрачная аналитика по всем метрикам",
        "Обширные возможности фильтрации для глубокого анализа",
        "Более быстрый рабочий процесс аналитиков и продуктивность",
        "Улучшенное принятие решений с ясной визуализацией данных"
      ],
      additionalImages: [
        "https://raw.githubusercontent.com/vehvsa/landing/refs/heads/main/product.png",
        "https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb24lMjBkYXNoYm9hcmR8ZW58MXx8fHx8MTc1OTU0NTU2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      category: "Analytics",
      industry: "Education",
      timeframe: "8 weeks",
      result: "60% faster data analysis workflows",
      showOnHomepage: true
    }
  ];
  
  return defaultHomepageSolutions;
}