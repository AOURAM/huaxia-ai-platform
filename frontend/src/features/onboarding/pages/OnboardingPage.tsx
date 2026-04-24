import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Bus,
  CheckCircle2,
  Coffee,
  GraduationCap,
  Home,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  UtensilsCrossed,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { saveOnboarding } from '@/api/onboarding';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/http';
import { cn } from '@/lib/utils';
import { StatusBanner } from '@/shared/components/common/StatusBanner';

type Step = 'welcome' | 'interests' | 'location' | 'help' | 'complete';

const INTERESTS = [
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

export function OnboardingPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('welcome');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['cities', 'universities']);
  const [locationQuery, setLocationQuery] = useState('');
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

  const saveAndComplete = async (skipped: boolean) => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await saveOnboarding({
        interests: skipped ? [] : selectedInterests,
        city: locationQuery.trim() || null,
        university: null,
        goal: skipped ? null : 'Find useful student life information',
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
    if (step === 'welcome') setStep('interests');
    if (step === 'interests') setStep('location');
    if (step === 'location') setStep('help');
    if (step === 'help') await saveAndComplete(false);
  };

  const goBack = () => {
    setErrorMessage(null);

    if (step === 'interests') setStep('welcome');
    if (step === 'location') setStep('interests');
    if (step === 'help') setStep('location');
  };

  const skipOnboarding = async () => {
    await saveAndComplete(true);
  };

  const finish = () => {
    navigate(ROUTES.home, { replace: true });
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#edf2f4] text-[#2b2d42]">
      {errorMessage ? (
        <div className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <StatusBanner tone="error" message={errorMessage} />
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {step === 'complete' ? <CompleteStep key="complete" onClose={finish} /> : null}

        {step === 'welcome' ? (
          <WelcomeStep key="welcome" onContinue={goNext} onSkip={skipOnboarding} isSaving={isSaving} />
        ) : null}

        {step === 'interests' ? (
          <InterestsStep
            key="interests"
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
            value={locationQuery}
            onChange={setLocationQuery}
            onBack={goBack}
            onContinue={goNext}
            isSaving={isSaving}
          />
        ) : null}

        {step === 'help' ? (
          <HelpStep
            key="help"
            stepIndex={stepIndex}
            onBack={goBack}
            onContinue={goNext}
            isSaving={isSaving}
          />
        ) : null}
      </AnimatePresence>
    </main>
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
    <div className="w-full">
      {align === 'split' ? (
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c7d0d4]">
            Onboarding Guide
          </span>
          <span className="text-xs font-bold text-brand-primary">Step {active} of 4</span>
        </div>
      ) : (
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8d99ae]">
            {label ?? `Step ${active} of 4`}
          </span>
        </div>
      )}

      <div className="mx-auto flex w-fit gap-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={cn(
              'h-1.5 w-14 rounded-full transition-colors',
              item <= active ? 'bg-brand-primary' : 'bg-[#d1d9db]',
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
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="mx-auto flex min-h-screen max-w-md items-center justify-center p-6"
    >
      <div className="w-full rounded-2xl border border-[#d1d9db] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <ProgressHeader active={1} />
        </div>

        <div className="mb-8 flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[#d1d9db]/40 bg-[#d1d9db]">
          <BookOpen className="h-16 w-16 text-brand-primary/35" />
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight">
          Find trustworthy student knowledge faster
        </h1>

        <p className="mb-10 leading-relaxed text-[#8d99ae]">
          Huaxia helps international students in China find useful answers about cities, universities, culture, and
          daily life.
        </p>

        <button
          type="button"
          onClick={onContinue}
          disabled={isSaving}
          className="w-full rounded-xl bg-brand-primary py-4 font-bold text-white shadow-sm transition hover:bg-brand-primary-hover active:scale-95 disabled:opacity-60"
        >
          Get started
        </button>

        <button
          type="button"
          onClick={onSkip}
          disabled={isSaving}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-[#8d99ae] transition hover:bg-brand-primary/5 disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Skip for now
        </button>
      </div>
    </motion.section>
  );
}

function InterestsStep({
  selected,
  onToggle,
  onBack,
  onContinue,
  isSaving,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      className="mx-auto min-h-screen max-w-5xl px-6 py-8"
    >
      <header className="mb-12 grid grid-cols-3 items-start">
        <button
          type="button"
          onClick={onBack}
          className="w-fit rounded-full p-2 transition hover:bg-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <ProgressHeader active={2} />

        <div />
      </header>

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-brand-primary">What are you interested in?</h1>
        <p className="text-lg text-[#8d99ae]">
          Select the topics that matter most to personalize your academic and cultural journey in China.
        </p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {INTERESTS.map((item, index) => {
          const isActive = selected.includes(item.id);
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onToggle(item.id)}
              className={cn(
                'relative rounded-2xl border-2 p-6 text-left transition-all duration-300',
                isActive
                  ? 'border-brand-primary bg-[#d1d9db] shadow-md'
                  : 'border-transparent bg-white hover:border-brand-primary/30 hover:shadow-sm',
              )}
            >
              {isActive ? (
                <div className="absolute right-4 top-4 rounded-full bg-brand-primary p-0.5 text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              ) : null}

              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
                  isActive ? 'bg-white text-brand-primary' : 'bg-[#d1d9db] text-[#8d99ae]',
                )}
              >
                <Icon className="h-6 w-6" />
              </div>

              <span className="text-xl font-bold">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <footer className="flex justify-end border-t border-[#d1d9db] pt-8">
        <button
          type="button"
          onClick={onContinue}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-brand-primary px-10 py-4 font-bold text-white shadow-sm transition hover:bg-brand-primary-hover active:scale-95 disabled:opacity-60"
        >
          Continue
          <ArrowRight className="h-5 w-5" />
        </button>
      </footer>
    </motion.section>
  );
}

function LocationStep({
  value,
  onChange,
  onBack,
  onContinue,
  isSaving,
}: {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-8"
    >
      <div className="mb-10">
        <ProgressHeader active={3} />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold">Where are you based?</h1>
          <p className="text-lg text-[#8d99ae]">Connect with peers in your city or university.</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8d99ae]" />
            <input
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Search city or university..."
              className="w-full rounded-2xl border border-[#d1d9db] bg-white py-5 pl-14 pr-6 text-lg shadow-sm outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onChange('Shanghai')}
              className="rounded-2xl border border-[#d1d9db]/60 bg-white p-8 text-left transition hover:border-brand-primary/50 hover:shadow-lg"
            >
              <Building2 className="mb-4 h-10 w-10 text-brand-primary" />
              <h3 className="text-2xl font-bold">Shanghai</h3>
              <p className="text-sm font-semibold text-[#8d99ae]">Current City</p>
            </button>

            <button
              type="button"
              onClick={() => onChange('Beijing')}
              className="rounded-2xl border border-[#d1d9db]/60 bg-white p-8 text-left transition hover:border-brand-primary/50 hover:shadow-lg"
            >
              <MapPin className="mb-4 h-10 w-10 text-brand-primary" />
              <h3 className="text-2xl font-bold">Beijing</h3>
              <p className="text-sm font-semibold text-[#8d99ae]">Target City</p>
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-16 flex items-center justify-between border-t border-[#d1d9db] pt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-bold text-[#8d99ae] transition hover:bg-white hover:text-[#2b2d42]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-brand-primary px-12 py-4 font-bold text-white shadow-md transition hover:bg-brand-primary-hover active:scale-95 disabled:opacity-60"
        >
          Next
          <ArrowRight className="h-5 w-5" />
        </button>
      </footer>
    </motion.section>
  );
}

function HelpStep({
  onBack,
  onContinue,
  isSaving,
}: {
  stepIndex: number;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8"
    >
      <div className="mb-10">
        <ProgressHeader active={4} align="split" />
      </div>

      <div className="flex-1">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">How can we help today?</h1>
          <p className="text-lg text-[#8d99ae]">
            Tell us what you're looking for, or browse curated resources to help you settle in.
          </p>
        </header>

        <div className="mb-14">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-brand-primary" />
            <input
              type="text"
              placeholder="Search for answers or community posts..."
              className="w-full rounded-3xl border border-[#d1d9db] bg-white py-6 pl-16 pr-6 text-lg shadow-md outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-2 text-sm font-bold text-[#8d99ae]">Popular:</span>
            {['Visa Renewal', 'Campus Life', 'Library Access'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="rounded-full border border-[#8d99ae] px-5 py-2 text-sm font-bold text-[#8d99ae] transition hover:bg-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-6">
          <div className="h-px flex-1 bg-[#d1d9db]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#8d99ae]">Or explore by</span>
          <div className="h-px flex-1 bg-[#d1d9db]" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: 'Explore by theme', desc: 'Browse posts categorized by topic.', icon: Smartphone },
            { title: 'Ask a question', desc: 'Post a specific question to the community.', icon: Coffee },
            { title: 'Recent posts', desc: 'See what others have found useful recently.', icon: BookOpen },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.title}
                type="button"
                className="group relative overflow-hidden rounded-3xl border border-[#d1d9db]/60 bg-white p-8 text-left transition hover:border-brand-primary/30 hover:shadow-xl"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-brand-primary/5 transition-transform group-hover:scale-125" />
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d1d9db] transition group-hover:bg-brand-primary group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{card.title}</h3>
                <p className="text-sm leading-relaxed text-[#8d99ae]">{card.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#d1d9db] pt-8 md:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl px-6 py-3 text-lg font-bold text-[#8d99ae] transition hover:bg-white hover:text-[#2b2d42]"
        >
          <ArrowLeft className="h-5 w-5" />
          Previous Step
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-brand-primary px-12 py-4 text-lg font-bold text-white shadow-xl transition hover:bg-brand-primary-hover active:scale-95 disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          Finish
          <ArrowRight className="h-6 w-6" />
        </button>
      </footer>
    </motion.section>
  );
}

function CompleteStep({ onClose }: { onClose: () => void }) {
  return (
    <motion.section
      key="complete"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#edf2f4]/90 p-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-[2rem] border border-brand-primary/10 bg-white p-12 text-center shadow-2xl">
        <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-brand-primary" />
        <h2 className="mb-4 text-3xl font-bold">Registration Complete!</h2>
        <p className="mb-8 text-[#8d99ae]">
          Thank you for joining Huaxia. Your onboarding choices have been saved.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-brand-primary px-8 py-3 font-bold text-white transition hover:bg-brand-primary-hover"
        >
          Close
        </button>
      </div>
    </motion.section>
  );
}