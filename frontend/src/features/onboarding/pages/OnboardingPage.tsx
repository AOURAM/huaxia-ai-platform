import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Bus,
  CheckCircle2,
  Coffee,
  Compass,
  GraduationCap,
  Home,
  Landmark,
  Loader2,
  MapPin,
  MessageCircleQuestion,
  ShieldCheck,
  Smartphone,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { saveOnboarding } from '@/api/onboarding';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/http';
import { cn } from '@/lib/utils';
import { StatusBanner } from '@/shared/components/common/StatusBanner';

type Step = 'welcome' | 'interests' | 'location' | 'help' | 'complete';

interface InterestOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface LocationOption {
  id: string;
  label: string;
  type: 'city' | 'university';
  city: string;
  university: string | null;
  description: string;
  icon: LucideIcon;
}

interface HelpOption {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  goal: string;
}

const INTERESTS: InterestOption[] = [
  { id: 'cities', label: 'Cities', icon: Building2 },
  { id: 'universities', label: 'Universities', icon: GraduationCap },
  { id: 'culture', label: 'Culture', icon: BookOpen },
  { id: 'daily_life', label: 'Daily Life', icon: Coffee },
  { id: 'housing', label: 'Housing', icon: Home },
  { id: 'visas', label: 'Visas', icon: ShieldCheck },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'study_tips', label: 'Study Tips', icon: BookOpen },
  { id: 'transportation', label: 'Transportation', icon: Bus },
];

const LOCATION_OPTIONS: LocationOption[] = [
  {
    id: 'city-shanghai',
    label: 'Shanghai',
    type: 'city',
    city: 'Shanghai',
    university: null,
    description: 'Current or target city',
    icon: Building2,
  },
  {
    id: 'city-beijing',
    label: 'Beijing',
    type: 'city',
    city: 'Beijing',
    university: null,
    description: 'Current or target city',
    icon: MapPin,
  },
  {
    id: 'city-guangzhou',
    label: 'Guangzhou',
    type: 'city',
    city: 'Guangzhou',
    university: null,
    description: 'Current or target city',
    icon: Building2,
  },
  {
    id: 'city-shenzhen',
    label: 'Shenzhen',
    type: 'city',
    city: 'Shenzhen',
    university: null,
    description: 'Current or target city',
    icon: Building2,
  },
  {
    id: 'city-hangzhou',
    label: 'Hangzhou',
    type: 'city',
    city: 'Hangzhou',
    university: null,
    description: 'Current or target city',
    icon: MapPin,
  },
  {
    id: 'city-nanjing',
    label: 'Nanjing',
    type: 'city',
    city: 'Nanjing',
    university: null,
    description: 'Current or target city',
    icon: MapPin,
  },
  {
    id: 'city-wuhan',
    label: 'Wuhan',
    type: 'city',
    city: 'Wuhan',
    university: null,
    description: 'Current or target city',
    icon: MapPin,
  },
  {
    id: 'city-chengdu',
    label: 'Chengdu',
    type: 'city',
    city: 'Chengdu',
    university: null,
    description: 'Current or target city',
    icon: MapPin,
  },
  {
    id: 'university-tsinghua',
    label: 'Tsinghua University',
    type: 'university',
    city: 'Beijing',
    university: 'Tsinghua University',
    description: 'University in Beijing',
    icon: GraduationCap,
  },
  {
    id: 'university-peking',
    label: 'Peking University',
    type: 'university',
    city: 'Beijing',
    university: 'Peking University',
    description: 'University in Beijing',
    icon: GraduationCap,
  },
  {
    id: 'university-fudan',
    label: 'Fudan University',
    type: 'university',
    city: 'Shanghai',
    university: 'Fudan University',
    description: 'University in Shanghai',
    icon: GraduationCap,
  },
  {
    id: 'university-sjtu',
    label: 'Shanghai Jiao Tong University',
    type: 'university',
    city: 'Shanghai',
    university: 'Shanghai Jiao Tong University',
    description: 'University in Shanghai',
    icon: GraduationCap,
  },
  {
    id: 'university-zhejiang',
    label: 'Zhejiang University',
    type: 'university',
    city: 'Hangzhou',
    university: 'Zhejiang University',
    description: 'University in Hangzhou',
    icon: GraduationCap,
  },
  {
    id: 'university-nanjing',
    label: 'Nanjing University',
    type: 'university',
    city: 'Nanjing',
    university: 'Nanjing University',
    description: 'University in Nanjing',
    icon: GraduationCap,
  },
  {
    id: 'university-wuhan',
    label: 'Wuhan University',
    type: 'university',
    city: 'Wuhan',
    university: 'Wuhan University',
    description: 'University in Wuhan',
    icon: GraduationCap,
  },
  {
    id: 'university-sichuan',
    label: 'Sichuan University',
    type: 'university',
    city: 'Chengdu',
    university: 'Sichuan University',
    description: 'University in Chengdu',
    icon: GraduationCap,
  },
];

const HELP_OPTIONS: HelpOption[] = [
  {
    id: 'explore-theme',
    label: 'Explore by theme',
    description: 'Browse posts categorized by cities, universities, culture, and daily life.',
    icon: Smartphone,
    goal: 'Explore posts by theme',
  },
  {
    id: 'ask-question',
    label: 'Ask a question',
    description: 'Post a specific question and get answers from the community.',
    icon: MessageCircleQuestion,
    goal: 'Ask questions to the community',
  },
  {
    id: 'recent-posts',
    label: 'Recent posts',
    description: 'See what other students have found useful recently.',
    icon: BookOpen,
    goal: 'Read recent useful posts',
  },
  {
    id: 'visa-renewal',
    label: 'Visa renewal',
    description: 'Find help about residence permit, documents, and renewal steps.',
    icon: ShieldCheck,
    goal: 'Find visa renewal information',
  },
  {
    id: 'campus-life',
    label: 'Campus life',
    description: 'Learn about libraries, dorms, classes, canteens, and campus services.',
    icon: Landmark,
    goal: 'Learn about campus life',
  },
  {
    id: 'daily-life-help',
    label: 'Daily life help',
    description: 'Find practical help about transport, food, housing, and payments.',
    icon: Coffee,
    goal: 'Get daily life help in China',
  },
];

const POPULAR_HELP = ['Visa Renewal', 'Campus Life', 'Library Access'];

export function OnboardingPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('welcome');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'cities',
    'universities',
  ]);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stepIndex = useMemo(() => {
    return {
      welcome: 1,
      interests: 2,
      location: 3,
      help: 4,
      complete: 4,
    }[step];
  }, [step]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((previous) =>
      previous.includes(goal) ? previous.filter((item) => item !== goal) : [...previous, goal],
    );
  };

  const saveAndComplete = async (skipped: boolean) => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await saveOnboarding({
        interests: skipped ? [] : selectedInterests,
        city: skipped ? null : selectedLocation?.city ?? null,
        university: skipped ? null : selectedLocation?.university ?? null,
        goal:
          skipped || selectedGoals.length === 0
            ? null
            : selectedGoals.join(', '),
        completed: true,
        skipped,
      });

      if (skipped) {
        navigate(ROUTES.home, { replace: true });
        return;
      }

      setStep('complete');
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'Unable to save onboarding.');
    } finally {
      setIsSaving(false);
    }
  };

  const goNext = async () => {
    setErrorMessage(null);

    if (step === 'welcome') {
      setStep('interests');
      return;
    }

    if (step === 'interests') {
      if (selectedInterests.length === 0) {
        setErrorMessage('Choose at least one interest or skip onboarding.');
        return;
      }

      setStep('location');
      return;
    }

    if (step === 'location') {
      setStep('help');
      return;
    }

    if (step === 'help') {
      await saveAndComplete(false);
    }
  };

  const goBack = () => {
    setErrorMessage(null);

    if (step === 'interests') {
      setStep('welcome');
      return;
    }

    if (step === 'location') {
      setStep('interests');
      return;
    }

    if (step === 'help') {
      setStep('location');
    }
  };

  const skipOnboarding = async () => {
    await saveAndComplete(true);
  };

  const finish = () => {
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-brand-surface px-5 py-8 text-brand-on-surface md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
<div className="flex items-center">
  <div>
    <p className="text-2xl font-black tracking-[-0.05em] text-brand-on-surface">Huaxia</p>
    <p className="text-sm font-semibold text-brand-on-surface/50">Onboarding Guide</p>
  </div>
</div>

        {step !== 'complete' ? (
          <button
            type="button"
            onClick={skipOnboarding}
            disabled={isSaving}
            className="rounded-full border border-brand-outline/60 bg-white/70 px-5 py-2 text-sm font-black text-brand-on-surface/60 transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Skip
          </button>
        ) : null}
      </div>

      <div className="mx-auto mt-10 max-w-6xl">
        {errorMessage ? (
          <div className="mx-auto mb-6 max-w-3xl">
            <StatusBanner tone="error" message={errorMessage} />
          </div>
        ) : null}

        <StepShell narrow={step === 'complete'}>
          <AnimatePresence mode="wait">
            {step === 'welcome' ? (
              <WelcomeStep onContinue={goNext} onSkip={skipOnboarding} isSaving={isSaving} />
            ) : null}

            {step === 'interests' ? (
              <InterestsStep
                active={stepIndex}
                selected={selectedInterests}
                onToggle={toggleInterest}
                onBack={goBack}
                onContinue={goNext}
                isSaving={isSaving}
              />
            ) : null}

            {step === 'location' ? (
              <LocationStep
                active={stepIndex}
                selectedLocation={selectedLocation}
                locations={LOCATION_OPTIONS}
                onSelect={setSelectedLocation}
                onBack={goBack}
                onContinue={goNext}
                isSaving={isSaving}
              />
            ) : null}

            {step === 'help' ? (
              <HelpStep
                active={stepIndex}
                selectedGoals={selectedGoals}
                options={HELP_OPTIONS}
                onToggleGoal={toggleGoal}
                onBack={goBack}
                onContinue={goNext}
                isSaving={isSaving}
              />
            ) : null}

            {step === 'complete' ? <CompleteStep onClose={finish} /> : null}
          </AnimatePresence>
        </StepShell>
      </div>
    </main>
  );
}

function StepShell({
  children,
  narrow = false,
}: {
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <section
      className={cn(
        'mx-auto rounded-[2rem] border border-brand-outline/50 bg-white/75 p-6 shadow-xl shadow-brand-primary/5 backdrop-blur md:p-10',
        narrow ? 'max-w-2xl' : 'max-w-5xl',
      )}
    >
      {children}
    </section>
  );
}

function ProgressHeader({
  active,
  label,
  align = 'center',
}: {
  active: number;
  label?: string;
  align?: 'center' | 'split';
}) {
  return (
    <div
      className={cn(
        'mb-10 flex gap-4',
        align === 'split'
          ? 'items-center justify-between'
          : 'flex-col items-center justify-center text-center',
      )}
    >
      {align === 'split' ? (
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-primary">
            Onboarding Guide
          </p>
          <p className="mt-1 text-sm font-bold text-brand-on-surface/45">Step {active} of 4</p>
        </div>
      ) : (
        <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-primary">
          {label ?? `Step ${active} of 4`}
        </p>
      )}

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={cn(
              'h-2 rounded-full transition-all',
              item <= active ? 'w-8 bg-brand-primary' : 'w-2 bg-brand-outline/50',
            )}
          />
        ))}
      </div>
    </div>
  );
}

function WelcomeStep({
  onContinue,
  onSkip,
  isSaving,
}: {
  onContinue: () => void;
  onSkip: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35 }}
      className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div>
        <div className="mb-6 flex flex-wrap gap-2">
          {['Cities', 'Universities', 'Culture', 'Daily Life'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-brand-outline/50 bg-brand-neutral-soft px-4 py-2 text-xs font-black text-brand-on-surface/60"
            >
              {item}
            </span>
          ))}
        </div>

        <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-brand-primary">
          Search real student discussions, ask practical questions, and find useful answers about
          studying and living in China.
        </p>

        <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.055em] text-brand-on-surface md:text-7xl">
          Find trustworthy student knowledge faster
        </h1>

        <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/62">
          Huaxia helps international students in China find useful answers about cities,
          universities, culture, and daily life.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-4 text-base font-black text-[#EDF2F4] transition hover:bg-brand-primary-hover"
          >
            Get started
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onSkip}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-outline bg-white px-6 py-4 text-base font-black text-brand-on-surface transition hover:bg-brand-neutral-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : null}
            Skip for now
          </button>
        </div>
      </div>

      <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-brand-on-surface p-6 text-[#EDF2F4]">
        <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-brand-primary/35 blur-3xl" />
        <div className="absolute bottom-[-110px] left-[-110px] h-72 w-72 rounded-full bg-[#EDF2F4]/10 blur-3xl" />

        <div className="relative z-10 space-y-4">
          {[
            ['Daily Life', 'How do I open a bank account in China?'],
            ['Universities', 'What documents do I need for registration?'],
            ['Cities', 'Which city is cheaper for students?'],
          ].map(([category, title]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.08] p-5"
            >
              <span className="rounded-full bg-brand-primary/25 px-3 py-1 text-xs font-black text-[#EDF2F4]">
                {category}
              </span>
              <p className="mt-4 text-lg font-black leading-7 text-[#EDF2F4]">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function InterestsStep({
  active,
  selected,
  onToggle,
  onBack,
  onContinue,
  isSaving,
}: {
  active: number;
  selected: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.div
      key="interests"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <ProgressHeader active={active} label="Step 2 of 4" />

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-brand-on-surface md:text-5xl">
          What are you interested in?
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/62">
          Select the topics that matter most to personalize your academic and cultural journey in
          China.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTERESTS.map((item) => {
          const isActive = selected.includes(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={cn(
                'relative rounded-2xl border-2 p-6 text-left transition-all duration-300',
                isActive
                  ? 'border-brand-primary bg-brand-primary/10 shadow-md'
                  : 'border-brand-outline bg-white hover:border-brand-primary/40 hover:shadow-sm',
              )}
            >
              {isActive ? (
                <CheckCircle2
                  className="absolute right-4 top-4 text-brand-primary"
                  size={22}
                />
              ) : null}

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary">
                <Icon size={24} />
              </div>

              <p className="text-xl font-black tracking-[-0.03em] text-brand-on-surface">
                {item.label}
              </p>
            </button>
          );
        })}
      </div>

      <FooterNav
        backLabel="Back"
        nextLabel="Next"
        onBack={onBack}
        onNext={onContinue}
        isSaving={isSaving}
      />
    </motion.div>
  );
}

function LocationStep({
  active,
  selectedLocation,
  locations,
  onSelect,
  onBack,
  onContinue,
  isSaving,
}: {
  active: number;
  selectedLocation: LocationOption | null;
  locations: LocationOption[];
  onSelect: (location: LocationOption) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.div
      key="location"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <ProgressHeader active={active} label="Step 3 of 4" />

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-brand-on-surface md:text-5xl">
          Where are you based?
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/62">
          Select your city or university so Huaxia can show more relevant student-life discussions.
        </p>
      </div>

      <div className="grid max-h-[520px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
        {locations.map((location) => {
          const Icon = location.icon;
          const isActive = selectedLocation?.id === location.id;

          return (
            <button
              key={location.id}
              type="button"
              onClick={() => onSelect(location)}
              className={cn(
                'relative rounded-2xl border p-7 text-left transition',
                isActive
                  ? 'border-brand-primary bg-brand-primary/10 shadow-md'
                  : 'border-brand-outline bg-white hover:border-brand-primary/50 hover:shadow-lg',
              )}
            >
              {isActive ? (
                <CheckCircle2
                  className="absolute right-4 top-4 text-brand-primary"
                  size={22}
                />
              ) : null}

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary">
                <Icon size={24} />
              </div>

              <h3 className="text-xl font-black tracking-[-0.03em] text-brand-on-surface">
                {location.label}
              </h3>

              <p className="mt-2 text-sm font-semibold text-brand-on-surface/55">
                {location.description}
              </p>
            </button>
          );
        })}
      </div>

      <FooterNav
        backLabel="Back"
        nextLabel="Next"
        onBack={onBack}
        onNext={onContinue}
        isSaving={isSaving}
      />
    </motion.div>
  );
}

function HelpStep({
  active,
  selectedGoals,
  options,
  onToggleGoal,
  onBack,
  onContinue,
  isSaving,
}: {
  active: number;
  selectedGoals: string[];
  options: HelpOption[];
  onToggleGoal: (goal: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.div
      key="help"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
    >
      <ProgressHeader active={active} label="Step 4 of 4" />

      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black tracking-[-0.04em] text-brand-on-surface md:text-5xl">
          How can we help today?
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/62">
          Choose one or more goals so Huaxia can guide your first experience.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-3">
        <span className="py-2 text-sm font-black text-brand-on-surface/50">Popular:</span>

        {POPULAR_HELP.map((tag) => {
          const goal = `Find help about ${tag}`;
          const active = selectedGoals.includes(goal);

          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleGoal(goal)}
              className={cn(
                'rounded-full border px-5 py-2 text-sm font-bold transition',
                active
                  ? 'border-brand-primary bg-brand-primary text-[#EDF2F4]'
                  : 'border-brand-outline bg-white text-brand-on-surface/55 hover:border-brand-primary hover:text-brand-primary',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-brand-primary">
        Or explore by
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {options.map((card) => {
          const Icon = card.icon;
          const active = selectedGoals.includes(card.goal);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onToggleGoal(card.goal)}
              className={cn(
                'relative overflow-hidden rounded-2xl border p-7 text-left transition',
                active
                  ? 'border-brand-primary bg-brand-primary/10 shadow-md'
                  : 'border-brand-outline bg-white hover:border-brand-primary/50 hover:shadow-lg',
              )}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary">
                <Icon size={24} />
              </div>

              <h3 className="text-xl font-black tracking-[-0.03em] text-brand-on-surface">
                {card.label}
              </h3>

              <p className="mt-2 text-sm font-medium leading-6 text-brand-on-surface/60">
                {card.description}
              </p>

              {active ? (
                <CheckCircle2
                  className="absolute right-4 top-4 text-brand-primary"
                  size={22}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedGoals.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-brand-primary/25 bg-brand-primary/10 p-5">
          <p className="mb-3 text-sm font-black text-brand-primary">Selected goals</p>

          <div className="flex flex-wrap gap-2">
            {selectedGoals.map((goal) => (
              <span
                key={goal}
                className="rounded-full bg-white px-3 py-2 text-xs font-black text-brand-on-surface/65"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <FooterNav
        backLabel="Back"
        nextLabel="Finish"
        onBack={onBack}
        onNext={onContinue}
        isSaving={isSaving}
      />
    </motion.div>
  );
}

function FooterNav({
  backLabel,
  nextLabel,
  onBack,
  onNext,
  isSaving,
}: {
  backLabel: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-2xl border border-brand-outline bg-white px-5 py-3 text-sm font-black text-brand-on-surface transition hover:bg-brand-neutral-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ArrowLeft size={17} />
        {backLabel}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 text-sm font-black text-[#EDF2F4] transition hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? <Loader2 className="animate-spin" size={17} /> : null}
        {nextLabel}
        {!isSaving ? <ArrowRight size={17} /> : null}
      </button>
    </div>
  );
}

function CompleteStep({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="text-center"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-primary text-[#EDF2F4]">
        <CheckCircle2 size={34} />
      </div>

      <h2 className="text-4xl font-black tracking-[-0.04em] text-brand-on-surface">
        Registration Complete!
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-lg font-medium leading-8 text-brand-on-surface/62">
        Thank you for joining Huaxia. Your onboarding choices have been saved.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-4 text-base font-black text-[#EDF2F4] transition hover:bg-brand-primary-hover"
      >
        Go to feed
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}