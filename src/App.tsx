import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Calendar, 
  Coins, 
  Mail, 
  Rocket, 
  Terminal, 
  Smartphone, 
  ShoppingCart, 
  BarChart3, 
  Cloud, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Lightbulb,
  MapPin,
  ExternalLink,
  Verified,
  Shield,
  Star,
  Info,
  Check,
  Briefcase
} from 'lucide-react';

// --- Types & Data ---

type Step = 'type' | 'maturity' | 'budget' | 'contact' | 'success' | 'portfolio';

interface FormData {
  projectTypes: string[];
  maturity: string;
  deadline: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const PROJECT_TYPES = [
  { id: 'web', title: 'Site web', description: 'Vitrines, corporate, landing pages haute performance.', icon: LayoutGrid },
  { id: 'mobile', title: 'Application mobile', description: 'iOS, Android et solutions hybrides natives.', icon: Smartphone },
  { id: 'custom', title: 'Logiciel sur mesure', description: 'SaaS, ERP, CRM et outils métiers spécifiques.', icon: Terminal },
  { id: 'ecommerce', title: 'E-commerce', description: 'Boutiques en ligne optimisées pour la conversion.', icon: ShoppingCart },
  { id: 'data', title: 'Data / BI / Dashboard', description: "Visualisation de données et outils d'aide à la décision.", icon: BarChart3 },
  { id: 'devops', title: 'DevOps / Cloud', description: 'Infrastructure évolutive et automatisation du déploiement.', icon: Cloud },
];

const MATURITY_OPTIONS = [
  { id: 'idea', label: 'Idée en tête' },
  { id: 'specs', label: 'Cahier des charges prêt' },
  { id: 'redesign', label: "Refonte d'existant" },
];

const DEADLINE_OPTIONS = [
  { id: 'urgent', label: 'Urgent (< 1 mois)' },
  { id: 'short', label: 'Court terme (1–3 mois)' },
  { id: 'medium', label: 'Moyen terme (3–6 mois)' },
  { id: 'none', label: 'Pas encore défini' },
];

const BUDGET_OPTIONS = [
  { id: 'micro', label: '< 5 000 €', sub: 'Projet ponctuel', icon: Coins },
  { id: 'small', label: '5 000 – 15 000 €', sub: 'MVP Standard', icon: Rocket },
  { id: 'medium', label: '15 000 – 50 000 €', sub: 'Échelle PME', icon: Briefcase, recommended: true },
  { id: 'large', label: '50 000 – 150 000 €', sub: 'Expertise Avancée', icon: Star },
  { id: 'enterprise', label: '150 000 € +', sub: 'Grand compte', icon: Cloud },
];

const PORTFOLIO_ITEMS = [
  {
    title: 'Plateforme logistique globale',
    category: 'E-commerce & Logistique',
    description: 'Refonte complète du système de gestion des flux pour un leader européen, permettant une réduction de 25% des temps de traitement.',
    tags: ['React', 'Go', 'Kubernetes'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_7JSruq-v5S8j3ouCmmREQ0w-eNELLVawI0qMnkKZ9T7U_HPwTYrfTzn4cxBa4dzldJkEgisL_g-nFkfXeR6I0y-2C_OjBKYvDn3hJTtdxOVsBlq6YKPvOh2N-9ZvIOS40o324RYIknKuQ_hfUEbNbasZ6OIzz4hIW99S5DY8Z74-Mjz5VOGXHhblAOdBt9hWRIqVrLvLLhRJEg8oU1k_QN9XDgXACArnowRnk3T3QtZWP3E3CNbZDH-F1oCK66iLo4cczB0F3h6x'
  },
  {
    title: 'Application de Fintech innovante',
    category: 'Mobile App',
    description: "Développement d'une néobanque sécurisée incluant le trading en temps réel et la gestion multi-devises.",
    tags: ['Flutter', 'Python', 'AWS Lambda'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4X-0ZrlWNyF4A-cY2N2TTGoO9yo6Jqa3lwPffiI8f1UEwP1vtk0rgVN1RGBEmlGb-8-vTYs67jQ5FSnpfQPzGbnUWn4pqze_55d05X7lklBW3Ev8mD8DIQEvDVUaNzU5-wgTMj0LWb3CcuQuZZgzJ53482YldLlO3j1N4lV2xyUZDASzOcfbjXaoTTY4gmmXbGnTkdN1I-kiV1FZNDluoOy-22nfpDnKr39Qr61UWyO_ACWGu-4nhRQKRQfs9daNN64fgZK0QAhcx'
  },
  {
    title: 'SaaS de Gestion de Ressources',
    category: 'SaaS B2B',
    description: "Optimisation de l'allocation des talents pour les entreprises de services numériques (ESN) internationales.",
    tags: ['Next.js', 'Prisma', 'PostgreSQL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdTfJLuqy6Z8piIZDu1Q8C4pd5H8CHaQDv5Nog5WqvpH5PRb8vDu4rvB3TbiSIFBL_T0yxW3uyBT9umvutJPXqFDA0nc7Nrq47tBFtLzpsG1y7G4oT1oVEY36ZeSsdHA8ES6YCisiV2oYVCqSJXsZCSP-MKJqdeX4ygZSQqZr1mGX6yKWUjv1Ut3bq4lBx99G_9OT7E-sXGbr0GFNAH0bqtio6wm1Zu6GPmXUI9Kk5BU3Ba_xuUcHZtck2f4Czheq6jgYsL_oOCuov'
  },
  {
    title: 'Refonte Système Bancaire',
    category: 'Enterprise IT',
    description: 'Migration critique de systèmes legacy vers une architecture micro-services résiliente et évolutive.',
    tags: ['Java Spring', 'Kafka', 'Docker'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB03srUgApapLkrYiJx8NopnajSYp66iQV6ejb9lqLlTuy6Bdhvjkni7cs6Z8GtmAs0QlH9-0kJGqhoAPkpVocx4FIFdMwRKDnVHCCNsg21OFzMRFTA-IF3PPQJ1dMouAGkhmXPrGDu9X_Taxzd1yjLFlL8MUZmR9fR9L63EbDGZQ9FDYuqVQG7V_7XyopTZDfA6tM8dtmTo86y2sGQDW8Ha2TgH0F0XtBA4dmV5qQ9qenQ4eQnyJGcusjLGvoIvGXf236CWsR3Bgd0'
  }
];

// --- Main App Component ---

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [formData, setFormData] = useState<FormData>({
    projectTypes: [],
    maturity: 'idea',
    deadline: 'short',
    budget: 'medium',
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const stepsOrder: Step[] = ['type', 'maturity', 'budget', 'contact', 'success'];
  const stepIndex = stepsOrder.indexOf(currentStep);

  const nextStep = () => {
    if (stepIndex < stepsOrder.length - 1) {
      setCurrentStep(stepsOrder[stepIndex + 1]);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setCurrentStep(stepsOrder[stepIndex - 1]);
    }
  };

  const handleTypeToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(id) 
        ? prev.projectTypes.filter(t => t !== id)
        : [...prev.projectTypes, id]
    }));
  };

  return (
    <div className="flex min-h-screen">
      {/* --- Sidebar --- */}
      <aside className="w-1/4 fixed h-screen bg-navy-sidebar text-white/70 overflow-hidden hidden lg:flex flex-col p-8 z-50">
        <div className="flex-1 space-y-12">
          {/* Brand */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setCurrentStep('type')}>
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
              <Terminal size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">HaiRun Technology</h1>
              <p className="text-xs text-white/50 font-medium">Expertise et Intégrité Logicielle</p>
            </div>
          </div>

          {/* Navigation Steps */}
          <nav className="space-y-2">
            {[
              { id: 'type', icon: LayoutGrid, label: 'Type de projet' },
              { id: 'maturity', icon: Calendar, label: 'Périmètre & délai' },
              { id: 'budget', icon: Coins, label: 'Budget estimatif' },
              { id: 'contact', icon: Mail, label: 'Vos coordonnées' },
            ].map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast = stepsOrder.indexOf(currentStep) > idx;
              return (
                <div 
                  key={step.id}
                  onClick={() => stepsOrder.indexOf(currentStep as Step) >= idx && currentStep !== 'success' && setCurrentStep(step.id as Step)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group
                    ${isActive ? 'bg-primary/10 text-primary border-l-4 border-primary rounded-l-none' : 'hover:text-white hover:bg-white/5'}
                  `}
                >
                  <step.icon size={20} className={isActive ? 'text-primary' : 'text-white/40'} />
                  <span className={`text-[15px] font-medium ${isActive ? 'text-white' : ''}`}>{step.label}</span>
                  {isPast && <CheckCircle2 size={16} className="ml-auto text-primary" fill="currentColor" />}
                </div>
              );
            })}

            {/* Extra: Realisations Tab */}
            <div 
              onClick={() => setCurrentStep('portfolio')}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group mt-8
                ${currentStep === 'portfolio' ? 'bg-white/10 text-white' : 'hover:text-white hover:bg-white/5'}
              `}
            >
              <Briefcase size={20} className="text-white/40" />
              <span className="text-[15px] font-medium">Nos réalisations</span>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-8 border-t border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/30">
          <div className="flex items-center gap-3">
            <Verified size={14} className="text-primary" />
            <span>Expertise Certifiée</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className="text-primary" />
            <span>Infrastructure Sécurisée</span>
          </div>
          <div className="flex items-center gap-3">
            <Star size={14} className="text-primary" />
            <span>Support Premium</span>
          </div>
          <button 
            onClick={() => setCurrentStep('type')}
            className="w-full mt-4 h-12 bg-primary hover:bg-blue-700 text-white font-bold rounded-full transition-all active:scale-95"
          >
            DÉMARRER L'ESTIMATION
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-[25%] bg-surface-background p-4 md:p-8 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
              <Terminal size={16} />
            </div>
            <span className="font-bold">HaiRun</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full">
            Étape {stepIndex + 1}/4
          </div>
        </div>

        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              <StepContent 
                step={currentStep} 
                formData={formData} 
                setFormData={setFormData}
                onNext={nextStep}
                onPrev={prevStep}
                onToggleType={handleTypeToggle}
                onStepChange={setCurrentStep}
              />
            </motion.div>
          </AnimatePresence>

          {/* Persistent Footer */}
          <footer className="mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
            <div>© 2024 HaiRun Technology. Tous droits réservés.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Contactez-nous</a>
              <a href="#" className="hover:text-primary transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

// --- Step Components ---

interface StepProps {
  step: Step;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  onPrev: () => void;
  onToggleType: (id: string) => void;
  onStepChange: (step: Step) => void;
}

function StepContent({ step, formData, setFormData, onNext, onPrev, onToggleType, onStepChange }: StepProps) {
  if (step === 'type') return <StepType formData={formData} onToggle={onToggleType} onNext={onNext} />;
  if (step === 'maturity') return <StepMaturity formData={formData} setFormData={setFormData} onNext={onNext} onPrev={onPrev} />;
  if (step === 'budget') return <StepBudget formData={formData} setFormData={setFormData} onNext={onNext} onPrev={onPrev} />;
  if (step === 'contact') return <StepContact formData={formData} setFormData={setFormData} onNext={onNext} onPrev={onPrev} onStepChange={onStepChange} />;
  if (step === 'success') return <StepSuccess formData={formData} onStepChange={onStepChange} />;
  if (step === 'portfolio') return <StepPortfolio />;
  return null;
}

function StepType({ formData, onToggle, onNext }: { formData: FormData; onToggle: (id: string) => void; onNext: () => void }) {
  return (
    <div className="bg-white rounded-container p-8 md:p-12 shadow-sm flex flex-col flex-1 h-full">
      <div className="mb-10">
        <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">ÉTAPE 1 / 4</span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Quel type de projet souhaitez-vous réaliser?</h2>
        <p className="text-slate-500 text-lg">Choisissez une ou plusieurs options pour nous aider à cadrer votre besoin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 flex-grow content-start">
        {PROJECT_TYPES.map((type) => {
          const isSelected = formData.projectTypes.includes(type.id);
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(type.id)}
              className={`p-6 rounded-card border-2 cursor-pointer transition-all flex flex-col gap-4 group
                ${isSelected ? 'border-primary bg-primary/[0.03]' : 'border-slate-100 hover:border-primary'}
              `}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${isSelected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary'}
              `}>
                <type.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{type.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{type.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-400">
          <Info size={18} />
          <span className="text-sm">Estimation gratuite en moins de 2 minutes.</span>
        </div>
        <button 
          onClick={onNext}
          disabled={formData.projectTypes.length === 0}
          className={`flex items-center gap-2 h-12 px-10 rounded-full font-bold transition-all
            ${formData.projectTypes.length > 0 ? 'bg-primary text-white hover:bg-blue-700 shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
        >
          Continuer
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function StepMaturity({ formData, setFormData, onNext, onPrev }: { formData: FormData; setFormData: any; onNext: () => void; onPrev: () => void }) {
  return (
    <div className="bg-white rounded-container p-8 md:p-12 shadow-sm flex flex-col flex-1 h-full">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
           <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold">2</span>
           <span className="text-primary font-bold text-xs uppercase tracking-widest block">Étape 02/04</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Où en êtes-vous dans votre projet ?</h2>
        <p className="text-slate-500 text-lg">Aidez-nous à comprendre le niveau de maturité et vos contraintes temporelles.</p>
      </div>

      <div className="space-y-12 flex-grow">
        {/* Avancement */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Rocket size={20} className="text-primary" />
            <h3 className="text-xl font-bold text-slate-900">Avancement du projet</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {MATURITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormData((p: any) => ({ ...p, maturity: opt.id }))}
                className={`px-8 py-3 rounded-full border-2 font-semibold transition-all
                  ${formData.maturity === opt.id ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-100 text-slate-500 hover:border-slate-300'}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Délai */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={20} className="text-primary" />
            <h3 className="text-xl font-bold text-slate-900">Délai souhaité</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {DEADLINE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormData((p: any) => ({ ...p, deadline: opt.id }))}
                className={`px-6 py-4 rounded-card border-2 font-semibold transition-all text-center
                  ${formData.deadline === opt.id ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-100 text-slate-500 hover:border-slate-300'}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-blue-50/50 p-6 rounded-card border border-blue-100 flex items-center gap-6">
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-primary">
            <Lightbulb size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-[15px]">Conseil d'expert</h4>
            <p className="text-sm text-slate-500">Un cahier des charges bien défini réduit le délai de production de 30% en moyenne.</p>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-12">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 h-12 px-6 rounded-full font-bold text-slate-500 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={18} />
          Précédent
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 h-12 px-10 rounded-full bg-primary text-white font-bold hover:bg-blue-700 shadow-lg transition-all"
        >
          Continuer
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function StepBudget({ formData, setFormData, onNext, onPrev }: { formData: FormData; setFormData: any; onNext: () => void; onPrev: () => void }) {
  return (
    <div className="bg-white rounded-container p-8 md:p-12 shadow-sm flex flex-col flex-1 h-full">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-1 bg-slate-100 rounded-full relative overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-primary" />
          </div>
          <span className="text-primary font-bold text-xs uppercase tracking-widest whitespace-nowrap">Étape 3 sur 4</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Quel budget envisagez-vous?</h2>
        <p className="text-slate-500 text-lg max-w-2xl">Cette estimation nous aide à proposer la meilleure solution adaptée à vos ambitions et contraintes technologiques.</p>
      </div>

      <div className="space-y-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BUDGET_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setFormData((p: any) => ({ ...p, budget: opt.id }))}
              className={`relative p-6 rounded-card border-2 cursor-pointer transition-all flex flex-col items-center text-center justify-between min-h-[160px] group
                ${formData.budget === opt.id ? 'border-slate-900 bg-blue-50/50' : 'border-slate-100 hover:border-primary'}
              `}
            >
              {opt.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Recommandé</div>
              )}
              <opt.icon size={24} className={formData.budget === opt.id ? 'text-primary' : 'text-slate-300 group-hover:text-primary'} />
              <div>
                <span className={`block font-bold text-sm ${formData.budget === opt.id ? 'text-primary' : 'text-slate-900'}`}>{opt.label}</span>
                <span className="text-[11px] text-slate-500 mt-1 block">{opt.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Range Visualization */}
        <div className="px-4">
           <div className="relative h-2 bg-slate-100 rounded-full mb-4">
              <div className="absolute left-0 top-0 h-full bg-primary w-1/2 rounded-full" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-md" />
           </div>
           <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Démarrage</span>
              <span>Expansion</span>
              <span>Entreprise</span>
           </div>
        </div>

        <section className="bg-white p-6 rounded-card border border-slate-100 flex items-center gap-6">
          <Shield size={24} className="text-primary" fill="#EFF6FF" />
          <p className="text-sm text-slate-500">Vos données budgétaires sont traitées avec une confidentialité absolue et ne servent qu'à ajuster la pertinence de notre chiffrage technique.</p>
        </section>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-12">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 h-12 px-6 rounded-full font-bold text-slate-500 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={18} />
          Précédent
        </button>
        <button 
          onClick={onNext}
          className="flex items-center gap-2 h-12 px-10 rounded-full bg-primary text-white font-bold hover:bg-blue-700 shadow-lg transition-all"
        >
          Continuer
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function StepContact({ formData, setFormData, onNext, onPrev, onStepChange }: { formData: FormData; setFormData: any; onNext: () => void; onPrev: () => void; onStepChange: (s: Step) => void }) {
  const selectedBudget = useMemo(() => BUDGET_OPTIONS.find(o => o.id === formData.budget)?.label, [formData.budget]);
  const selectedTypes = useMemo(() => formData.projectTypes.map(id => PROJECT_TYPES.find(t => t.id === id)?.title).join(', '), [formData.projectTypes]);
  const selectedDeadline = useMemo(() => DEADLINE_OPTIONS.find(o => o.id === formData.deadline)?.label, [formData.deadline]);

  return (
    <div className="bg-white rounded-container p-8 md:p-12 shadow-sm flex flex-col flex-1 h-full">
      <div className="mb-10">
        <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Dernière étape — On vous contacte!</span>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Presque terminé !</h2>
        <p className="text-slate-500 text-lg">Un expert HaiRun vous répond sous 24h pour affiner votre besoin et valider l'estimation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow content-start">
        {/* Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wider">PRÉNOM & NOM</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 focus:bg-white focus:border-slate-900 transition-all outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wider">EMAIL PROFESSIONNEL</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData((p: any) => ({ ...p, email: e.target.value }))}
                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 focus:bg-white focus:border-slate-900 transition-all outline-none" 
              />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wider">TÉLÉPHONE</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData((p: any) => ({ ...p, phone: e.target.value }))}
                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 focus:bg-white focus:border-slate-900 transition-all outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 tracking-wider">NOM DE L'ENTREPRISE</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => setFormData((p: any) => ({ ...p, company: e.target.value }))}
                className="w-full h-14 bg-slate-50 border-2 border-slate-50 rounded-xl px-4 focus:bg-white focus:border-slate-900 transition-all outline-none" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 tracking-wider">MESSAGE (OPTIONNEL)</label>
            <textarea 
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData((p: any) => ({ ...p, message: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-4 py-4 focus:bg-white focus:border-slate-900 transition-all outline-none resize-none" 
              placeholder="Décrivez votre besoin en quelques mots..."
            />
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <Shield size={16} />
            <span className="text-[11px] font-medium leading-relaxed">Vos données sont protégées et traitées selon notre politique de confidentialité.</span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 p-6 rounded-card border border-slate-100 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Récapitulatif</h3>
              <button 
                onClick={() => onStepChange('type')}
                className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-all"
              >
                <Terminal size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-slate-400">Type</span>
                <span className="text-sm font-bold text-slate-900 text-right">{selectedTypes}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-slate-400">Délai</span>
                <span className="text-sm font-bold text-slate-900 text-right">{selectedDeadline}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-medium text-slate-400">Budget</span>
                <span className="text-sm font-bold text-slate-900 text-right">{selectedBudget}</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden h-32 relative">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkNze18H5DDYzBr47TXRm734oCUKeBEv7ZUnS6P3ykEY6_a7rU4DZFpgLgMOcf45SMlTpkHJQ1yCJFkvNxEP8P41HgC8IgkfXbCaB7S1dF8Vwy60IB02mGWHGv2zg_Qx2WRf1zqLeK-2qCMWWRfxcVkWjEg58ZN8Jw5SoSvbxOmAAYqNei5C5a5R8_a7XI69jcT6IULiTpsxHowxKg5yf6uTq516b3w1zKU7aV3WMWLjGyu6duSgaTYpg-8ceaZ8JybRsuZkGdvBZ-" alt="Office" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-navy-sidebar/20" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-12">
        <button 
          onClick={onPrev}
          className="flex items-center gap-2 h-12 px-6 rounded-full font-bold text-slate-500 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft size={18} />
          Précédent
        </button>
        <button 
          onClick={onNext}
          disabled={!formData.name || !formData.email}
          className={`flex items-center gap-3 h-12 px-12 rounded-full font-bold shadow-lg transition-all
            ${formData.name && formData.email ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
        >
          Envoyer ma demande
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function StepSuccess({ formData, onStepChange }: { formData: FormData; onStepChange: (s: Step) => void }) {
  return (
    <div className="bg-white rounded-container p-12 md:p-20 shadow-sm flex flex-col items-center text-center justify-center flex-1 h-full">
      <div className="mb-8 relative h-32 w-32 flex items-center justify-center bg-blue-50 rounded-full">
        <svg className="h-[72px] w-[72px]" viewBox="0 0 52 52">
          <circle className="success-checkmark-ring" cx="26" cy="26" fill="none" r="25"></circle>
          <path className="success-checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none"></path>
        </svg>
      </div>
      
      <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Merci {formData.name.split(' ')[0]} ! Votre demande est bien reçue 🎉</h2>
      <p className="text-lg text-slate-500 max-w-2xl mb-12 leading-relaxed">
        Un expert <span className="text-primary font-bold">HaiRun Technology</span> vous contactera dans les <span className="font-bold">24h ouvrées</span> à l'adresse <span className="text-slate-900 font-bold">{formData.email}</span> pour approfondir votre projet et affiner l'estimation.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full max-w-xl">
        <button 
          onClick={() => onStepChange('type')}
          className="flex-1 h-14 bg-navy-sidebar text-white rounded-full font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          Retour à l'accueil
        </button>
        <button 
          onClick={() => onStepChange('portfolio')}
          className="flex-1 h-14 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          Découvrir nos réalisations
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[
          { title: 'Accélération Stratégique', text: 'Nos méthodes Agiles garantissent un Time-to-Market optimisé.', icon: Rocket },
          { title: 'Qualité Industrielle', text: 'Code audité et tests automatisés sur 100% du périmètre.', icon: Verified },
          { title: 'Scalabilité Cloud', text: 'Architectures conçues pour absorber une croissance infinie.', icon: Cloud },
        ].map((feat, i) => (
          <div key={i} className="p-6 bg-slate-50 rounded-card border border-slate-100 text-left space-y-3">
            <feat.icon size={20} className="text-primary" />
            <h4 className="font-bold text-slate-900">{feat.title}</h4>
            <p className="text-sm text-slate-500">{feat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPortfolio() {
  return (
    <div className="flex flex-col gap-12 mb-16 h-full">
      <header className="space-y-4">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
           <span className="hover:text-primary cursor-pointer">Accueil</span>
           <ChevronRight size={14} />
           <span className="text-primary">Réalisations</span>
        </nav>
        <h2 className="text-4xl font-extrabold text-slate-900">Nos meilleures réalisations</h2>
        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
          Découvrez comment nous accompagnons nos clients dans leur transformation digitale à travers des solutions sur-mesure et innovantes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PORTFOLIO_ITEMS.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-container overflow-hidden border border-slate-100 hover:border-slate-900 transition-all shadow-sm"
          >
            <div className="h-64 overflow-hidden relative">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className="bg-navy-sidebar/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-bold px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full">{tag}</span>
                ))}
              </div>
              <button className="flex items-center gap-2 font-bold text-primary text-[15px] hover:translate-x-1 transition-transform">
                Voir le case study
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-12 bg-white rounded-container text-center space-y-8 border-2 border-slate-950 border-dashed">
         <div className="space-y-4">
            <h3 className="text-3xl font-extrabold text-slate-900">Prêt à lancer votre prochain projet ?</h3>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Notre équipe d'experts est là pour transformer vos idées en solutions logicielles performantes et sécurisées.
            </p>
         </div>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <button className="h-14 px-12 bg-navy-sidebar text-white rounded-full font-bold shadow-xl hover:opacity-90 transition-all">
              Prendre rendez-vous
           </button>
           <button className="h-14 px-12 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary/5 transition-all">
              Consulter nos tarifs
           </button>
         </div>
      </div>
    </div>
  );
}
