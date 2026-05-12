import {
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Landmark,
  MapPin,
  MessageSquareText,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const sections = [
  {
    title: 'Cities',
    description: 'Explore city life, transport, housing, food, and student experiences across China.',
    icon: MapPin,
    href: ROUTES.cities,
  },
  {
    title: 'Universities',
    description: 'Find discussions about campus life, registration, dormitories, courses, and study support.',
    icon: GraduationCap,
    href: ROUTES.universities,
  },
  {
    title: 'Culture',
    description: 'Understand Chinese customs, festivals, etiquette, food culture, and daily communication.',
    icon: Landmark,
    href: ROUTES.culture,
  },
  {
    title: 'Daily Life',
    description: 'Get practical help with payments, SIM cards, banking, accommodation, and transportation.',
    icon: Building2,
    href: ROUTES.dailyLife,
  },
];

const searchExamples = [
  'How do I open a bank account in China?',
  'Which city is cheaper for international students?',
  'What documents do I need for university registration?',
  'How can I solve dormitory problems?',
];

const workflow = [
  {
    title: 'Students post',
    description: 'Users share questions, guides, tips, and experiences from real student life.',
    icon: MessageSquareText,
  },
  {
    title: 'AI organizes',
    description: 'The system generates categories, summaries, and tags to structure the content.',
    icon: Brain,
  },
  {
    title: 'Search finds meaning',
    description: 'Semantic search retrieves relevant posts even when users use different words.',
    icon: Search,
  },
];

function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-outline/40 bg-brand-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to={ROUTES.landing} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-sm">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-brand-on-surface">Huaxia</p>
            <p className="text-xs font-medium text-brand-on-surface/50">Student knowledge in China</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-brand-on-surface/65 md:flex">
          <a href="#sections" className="transition hover:text-brand-primary">
            Sections
          </a>
          <a href="#search" className="transition hover:text-brand-primary">
            Search
          </a>
          <a href="#workflow" className="transition hover:text-brand-primary">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.login}
            className="hidden rounded-xl px-4 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-neutral-soft sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to={ROUTES.register}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-primary-hover"
          >
            Join Huaxia
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-brand-surface font-sans text-brand-on-surface">
      <LandingHeader />

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
        <div className="absolute right-[-120px] top-32 h-[320px] w-[320px] rounded-full bg-brand-accent/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-outline/60 bg-white/60 px-4 py-2 text-sm font-bold text-brand-primary shadow-sm">
              <Globe2 size={16} />
              International student community in China
            </div>

            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-[-0.045em] text-brand-on-surface md:text-6xl lg:text-7xl">
              Find student-life answers by meaning, not by scrolling forever.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-on-surface/65 md:text-xl">
              Huaxia helps international students in China ask questions, share experience, browse
              thematic pages, and discover practical answers through AI categorization and semantic
              search.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTES.register}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-brand-primary/20 transition hover:bg-brand-primary-hover"
              >
                Create account
                <ArrowRight size={18} />
              </Link>
              <Link
                to={ROUTES.login}
                className="inline-flex items-center justify-center rounded-2xl border border-brand-outline bg-white/70 px-6 py-4 text-base font-extrabold text-brand-on-surface shadow-sm transition hover:bg-brand-neutral-soft"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                ['4', 'main sections'],
                ['AI', 'categorization'],
                ['Search', 'by meaning'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-brand-outline/50 bg-white/60 p-4 shadow-sm"
                >
                  <p className="text-2xl font-extrabold text-brand-primary">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-brand-on-surface/55">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-10"
          >
            <div className="rounded-[2rem] border border-brand-outline/50 bg-white/75 p-5 shadow-2xl shadow-brand-primary/10 backdrop-blur">
              <div className="rounded-[1.5rem] bg-brand-on-surface p-5 text-white">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/50">Search preview</p>
                    <h2 className="mt-1 text-xl font-extrabold">Ask naturally</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Search size={22} />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                    Query
                  </p>
                  <p className="text-base font-semibold">
                    “How do I survive my first month in China?”
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {searchExamples.map((example, index) => (
                    <div
                      key={example}
                      className="rounded-2xl border border-white/10 bg-white/[0.07] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-xs font-bold text-white/45">Result {index + 1}</p>
                        <span className="rounded-full bg-brand-success/20 px-3 py-1 text-xs font-bold text-brand-success">
                          semantic match
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-white/85">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="sections" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand-primary">
            Thematic discovery
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] md:text-5xl">
            Browse the problems students actually have.
          </h2>
          <p className="mt-4 text-lg leading-8 text-brand-on-surface/60">
            Huaxia keeps the platform focused around the four sections that matter most for student
            life in China.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.title}
                to={section.href}
                className="group rounded-[1.7rem] border border-brand-outline/50 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/10"
              >
                <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary transition group-hover:bg-brand-primary group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-on-surface">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-on-surface/60">
                  {section.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand-primary">
                  Open section
                  <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="search" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-brand-outline/50 bg-brand-primary p-8 text-white shadow-xl shadow-brand-primary/15">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Search size={28} />
            </div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/55">
              Semantic search
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.035em]">
              Search what you mean.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Students often describe the same issue with different words. Huaxia uses embeddings
              and similarity ranking to return posts that match the meaning of the query.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              'Natural-language search from the home page',
              'Contextual search inside thematic pages',
              'AI-generated tags for faster scanning',
              'Fallback behavior when AI metadata is missing',
            ].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-[1.5rem] border border-brand-outline/50 bg-white/70 p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-1 shrink-0 text-brand-success" size={22} />
                <p className="text-base font-bold leading-7 text-brand-on-surface/75">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand-primary">
            Community workflow
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.035em] md:text-5xl">
            Built around posting, organizing, and finding.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {workflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-[1.7rem] border border-brand-outline/50 bg-white/70 p-6 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary">
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-extrabold text-brand-on-surface/30">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-on-surface/60">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-brand-on-surface p-8 text-white shadow-2xl md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/40">
                Ready for demo
              </p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.035em]">
                Start building the student knowledge base.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
                Create an account and test the full MVP loop: onboarding, post creation, AI tags,
                semantic search, post detail, comments, and reactions.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to={ROUTES.register}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-extrabold text-brand-on-surface transition hover:bg-brand-neutral-soft"
              >
                Create account
                <ArrowRight size={18} />
              </Link>
              <Link
                to={ROUTES.login}
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-4 text-base font-extrabold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-outline/40 px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-brand-on-surface/50 md:flex-row">
          <div className="flex items-center gap-2 font-bold text-brand-on-surface">
            <BookOpen size={18} />
            Huaxia
          </div>
          <p>AI-driven semantic search community platform for international students in China.</p>
          <div className="flex items-center gap-2">
            <Users size={16} />
            Student life knowledge
          </div>
        </div>
      </footer>
    </main>
  );
}