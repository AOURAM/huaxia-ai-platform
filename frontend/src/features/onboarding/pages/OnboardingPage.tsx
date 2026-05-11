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
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
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

  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);

  const [helpQuery, setHelpQuery] = useState('');
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

  const filteredLocations = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();

    if (!query) {
      return LOCATION_OPTIONS;
    }

    return LOCATION_OPTIONS.filter((item) => {
      return (
        item.label.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.university?.toLowerCase().includes(query)
      );
    });
  }, [locationQuery]);

  const filteredHelpOptions = useMemo(() => {
    const query = helpQuery.trim().toLowerCase();

    if (!query) {
      return HELP_OPTIONS;
    }

    return HELP_OPTIONS.filter((item) => {
      return (
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.goal.toLowerCase().includes(query)
      );
    });
  }, [helpQuery]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((previous) =>
      previous.includes(goal)
        ? previous.filter((item) => item !== goal)
        : [...previous, goal],
    );
  };

  const saveAndComplete = async (skipped: boolean) => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const customLocation = locationQuery.trim();
      const customGoal = helpQuery.trim();

      await saveOnboarding({
        interests: skipped ? [] : selectedInterests,
        city: skipped
          ? null
          : (selectedLocation?.city ?? customLocation) || null,
        university: skipped ? null : selectedLocation?.university ?? null,
        goal: skipped
          ? null
          : selectedGoals.length > 0
            ? selectedGoals.join(', ')
            : customGoal || 'Find useful student life information',
        completed: true,
        skipped,
      });

      if (skipped) {
        navigate(ROUTES.home, { replace: true });
        return;
      }

      setStep('complete');
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : 'Unable to save onboarding.',
      );
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
      const customLocation = locationQuery.trim();

      if (!selectedLocation && customLocation) {
        setSelectedLocation({
          id: `custom-${customLocation.toLowerCase().replace(/\s+/g, '-')}`,
          label: customLocation,
          type: 'city',
          city: customLocation,
          university: null,
          description: 'Custom location',
          icon: MapPin,
        });
      }

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
    <main className="min-h-screen bg-brand-neutral-soft px-6 py-10 text-brand-on-surface">
      <div className="mx-auto max-w-5xl">
        {errorMessage ? (
          <div className="mb-6">
            <StatusBanner tone="error" message={errorMessage} />
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {step === 'welcome' ? (
            <WelcomeStep
              key="welcome"
              onContinue={goNext}
              onSkip={skipOnboarding}
              isSaving={isSaving}
            />
          ) : null}

          {step === 'interests' ? (
            <InterestsStep
              key="interests"
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
              key="location"
              active={stepIndex}
              query={locationQuery}
              selectedLocation={selectedLocation}
              locations={filteredLocations}
              onQueryChange={(value) => {
                setLocationQuery(value);
                setSelectedLocation(null);
              }}
              onSelect={(location) => {
                setSelectedLocation(location);
                setLocationQuery(location.label);
              }}
              onBack={goBack}
              onContinue={goNext}
              isSaving={isSaving}
            />
          ) : null}

          {step === 'help' ? (
            <HelpStep
              key="help"
              active={stepIndex}
              query={helpQuery}
              selectedGoals={selectedGoals}
              options={filteredHelpOptions}
              onQueryChange={setHelpQuery}
              onToggleGoal={toggleGoal}
              onBack={goBack}
              onContinue={goNext}
              isSaving={isSaving}
            />
          ) : null}

          {step === 'complete' ? <CompleteStep key="complete" onClose={finish} /> : null}
        </AnimatePresence>
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
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.25 }}
      className={cn('mx-auto', narrow ? 'max-w-md' : 'max-w-5xl')}
    >
      {children}
    </motion.section>
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
    <div className="mb-14">
      {align === 'split' ? (
        <div className="mb-8 flex items-center justify-between text-xs font-black uppercase tracking-[0.25em] text-brand-on-surface/35">
          <span>Onboarding Guide</span>
          <span className="text-brand-primary">Step {active} of 4</span>
        </div>
      ) : (
        <p className="mb-8 text-center text-xs font-black uppercase tracking-[0.25em] text-brand-on-surface/45">
          {label ?? `Step ${active} of 4`}
        </p>
      )}

      <div className="mx-auto flex max-w-xs justify-center gap-3">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={cn(
              'h-1.5 w-16 rounded-full transition',
              item <= active ? 'bg-brand-primary' : 'bg-brand-outline',
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
    <StepShell narrow>
      <div className="rounded-3xl border border-brand-outline bg-white p-8 shadow-sm">
        <ProgressHeader active={1} />

        <div className="mb-8 rounded-2xl border border-brand-outline bg-brand-neutral-soft p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {['Cities', 'Universities', 'Culture', 'Daily Life'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-brand-outline bg-white px-3 py-1 text-xs font-black text-brand-on-surface/60"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="text-sm font-bold leading-7 text-brand-on-surface/60">
            Search real student discussions, ask practical questions, and find useful
            answers about studying and living in China.
          </p>
        </div>

        <h1 className="font-serif text-4xl font-black leading-tight text-brand-on-surface">
          Find trustworthy student knowledge faster
        </h1>

        <p className="mt-6 text-base leading-8 text-brand-on-surface/55">
          Huaxia helps international students in China find useful answers about
          cities, universities, culture, and daily life.
        </p>

        <button
          type="button"
          onClick={onContinue}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-brand-primary/20 transition hover:bg-brand-primary-hover"
        >
          Get started
          <ArrowRight className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={isSaving}
          className="mt-6 flex w-full items-center justify-center text-sm font-bold text-brand-on-surface/45 transition hover:text-brand-primary disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Skip for now
        </button>
      </div>
    </StepShell>
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
    <StepShell>
      <ProgressHeader active={active} />

      <div className="text-center">
        <h1 className="font-serif text-4xl font-black text-brand-on-surface">
          What are you interested in?
        </h1>

        <p className="mt-4 text-base text-brand-on-surface/55">
          Select the topics that matter most to personalize your academic and cultural
          journey in China.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-brand-primary" />
              ) : null}

              <Icon
                className={cn(
                  'mb-6 h-10 w-10',
                  isActive ? 'text-brand-primary' : 'text-brand-on-surface/45',
                )}
              />

              <span className="font-serif text-xl font-black text-brand-on-surface">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <FooterNav
        backLabel="Back"
        nextLabel="Continue"
        onBack={onBack}
        onNext={onContinue}
        isSaving={isSaving}
      />
    </StepShell>
  );
}

function LocationStep({
  active,
  query,
  selectedLocation,
  locations,
  onQueryChange,
  onSelect,
  onBack,
  onContinue,
  isSaving,
}: {
  active: number;
  query: string;
  selectedLocation: LocationOption | null;
  locations: LocationOption[];
  onQueryChange: (value: string) => void;
  onSelect: (location: LocationOption) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <StepShell>
      <ProgressHeader active={active} />

      <div className="text-center">
        <h1 className="font-serif text-4xl font-black text-brand-on-surface">
          Where are you based?
        </h1>

        <p className="mt-4 text-base text-brand-on-surface/55">
          Search and select your city or university. You can also type your own city.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-3xl">
        <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-brand-on-surface/45" />

        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search city or university..."
          className="w-full rounded-2xl border border-brand-outline bg-white py-5 pl-16 pr-6 text-lg shadow-sm outline-none transition placeholder:text-brand-on-surface/35 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5"
        />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {locations.map((location) => {
          const Icon = location.icon;
          const isActive = selectedLocation?.id === location.id;

          return (
            <button
              key={location.id}
              type="button"
              onClick={() => onSelect(location)}
              className={cn(
                'rounded-2xl border p-7 text-left transition',
                isActive
                  ? 'border-brand-primary bg-brand-primary/10 shadow-md'
                  : 'border-brand-outline bg-white hover:border-brand-primary/50 hover:shadow-lg',
              )}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <Icon className="h-10 w-10 text-brand-primary" />
                {isActive ? <CheckCircle2 className="h-5 w-5 text-brand-primary" /> : null}
              </div>

              <h3 className="font-serif text-2xl font-black text-brand-on-surface">
                {location.label}
              </h3>

              <p className="mt-2 text-sm font-bold text-brand-on-surface/45">
                {location.description}
              </p>
            </button>
          );
        })}
      </div>

      {locations.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-brand-outline bg-white p-8 text-center">
          <Compass className="mx-auto mb-4 h-8 w-8 text-brand-primary/60" />
          <h3 className="font-serif text-xl font-black text-brand-on-surface">
            No saved option found
          </h3>
          <p className="mt-2 text-sm text-brand-on-surface/55">
            You can still continue with “{query.trim()}” as your custom city.
          </p>
        </div>
      ) : null}

      <FooterNav
        backLabel="Back"
        nextLabel="Next"
        onBack={onBack}
        onNext={onContinue}
        isSaving={isSaving}
      />
    </StepShell>
  );
}

function HelpStep({
  active,
  query,
  selectedGoals,
  options,
  onQueryChange,
  onToggleGoal,
  onBack,
  onContinue,
  isSaving,
}: {
  active: number;
  query: string;
  selectedGoals: string[];
  options: HelpOption[];
  onQueryChange: (value: string) => void;
  onToggleGoal: (goal: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <StepShell>
      <ProgressHeader active={active} align="split" />

      <h1 className="font-serif text-4xl font-black text-brand-on-surface">
        How can we help today?
      </h1>

      <p className="mt-4 text-base text-brand-on-surface/55">
        Tell us what you are looking for, or choose one or more goals below.
      </p>

      <div className="relative mt-12">
        <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-brand-primary" />

        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search for answers or community posts..."
          className="w-full rounded-2xl border border-brand-outline bg-white py-5 pl-16 pr-6 text-lg shadow-sm outline-none transition placeholder:text-brand-on-surface/35 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="text-sm font-black text-brand-on-surface/45">Popular:</span>

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
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-brand-outline bg-white text-brand-on-surface/55 hover:border-brand-primary hover:text-brand-primary',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="my-14 flex items-center gap-8">
        <span className="h-px flex-1 bg-brand-outline" />
        <span className="text-xs font-black uppercase tracking-[0.25em] text-brand-on-surface/40">
          Or explore by
        </span>
        <span className="h-px flex-1 bg-brand-outline" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
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
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-brand-primary/5" />

              <div className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-neutral-soft text-brand-on-surface">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="relative font-serif text-2xl font-black text-brand-on-surface">
                {card.label}
              </h3>

              <p className="relative mt-4 text-sm leading-7 text-brand-on-surface/55">
                {card.description}
              </p>

              {active ? (
                <CheckCircle2 className="absolute right-5 top-5 h-5 w-5 text-brand-primary" />
              ) : null}
            </button>
          );
        })}
      </div>

      {options.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-outline bg-white p-8 text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-brand-primary/60" />
          <h3 className="font-serif text-xl font-black text-brand-on-surface">
            No matching goal found
          </h3>
          <p className="mt-2 text-sm text-brand-on-surface/55">
            You can still finish onboarding and save “{query.trim()}” as your goal.
          </p>
        </div>
      ) : null}

      {selectedGoals.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-brand-outline bg-white p-5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-brand-on-surface/45">
            Selected goals
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedGoals.map((goal) => (
              <span
                key={goal}
                className="rounded-full border border-brand-outline bg-brand-neutral-soft px-3 py-1.5 text-xs font-black text-brand-on-surface/65"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <FooterNav
        backLabel="Previous Step"
        nextLabel="Finish"
        onBack={onBack}
        onNext={onContinue}
        isSaving={isSaving}
      />
    </StepShell>
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
    <div className="mt-16 flex items-center justify-between border-t border-brand-outline pt-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-brand-on-surface/45 transition hover:text-brand-primary"
      >
        <ArrowLeft className="h-5 w-5" />
        {backLabel}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-8 py-4 text-sm font-black text-white shadow-lg shadow-brand-primary/20 transition hover:bg-brand-primary-hover disabled:opacity-60"
      >
        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {nextLabel}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function CompleteStep({ onClose }: { onClose: () => void }) {
  return (
    <StepShell narrow>
      <div className="rounded-3xl border border-brand-outline bg-white p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-brand-primary" />

        <h2 className="font-serif text-3xl font-black text-brand-on-surface">
          Registration Complete!
        </h2>

        <p className="mt-4 text-sm leading-7 text-brand-on-surface/55">
          Thank you for joining Huaxia. Your onboarding choices have been saved.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 rounded-xl bg-brand-primary px-8 py-4 text-sm font-black text-white shadow-lg shadow-brand-primary/20 transition hover:bg-brand-primary-hover"
        >
          Go to feed
        </button>
      </div>
    </StepShell>
  );
}