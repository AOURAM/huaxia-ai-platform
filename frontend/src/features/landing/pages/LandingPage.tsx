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
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const sections = [
  {
    title: 'Cities',
    description: 'Compare student life, cost, transport, and local experience across Chinese cities.',
    icon: MapPin,
  },
  {
    title: 'Universities',
    description: 'Find admission, scholarship, campus, dormitory, and course discussions.',
    icon: GraduationCap,
  },
  {
    title: 'Culture',
    description: 'Understand customs, food, festivals, etiquette, and language context.',
    icon: Landmark,
  },
  {
    title: 'Daily Life',
    description: 'Solve practical problems around payments, housing, SIM cards, food, and transport.',
    icon: Building2,
  },
];

const searchExamples = [
  'How do I use mobile payment apps in China?',
  'Which city is cheaper for international students?',
  'What documents do I need for university registration?',
  'How do students handle dormitory problems?',
];

const workflow = [
  {
    title: 'Students share',
    description: 'Create questions, guides, experiences, and tips from real student life.',
    icon: MessageSquareText,
  },
  {
    title: 'AI organizes',
    description: 'Huaxia shows categories, summaries, and tags when AI metadata is available.',
    icon: Brain,
  },
  {
    title: 'Search by meaning',
    description: 'Natural-language search helps users find relevant posts beyond exact keywords.',
    icon: Search,
  },
];

function LandingHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-brand-outline bg-brand-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-6">
        <Link to={ROUTES.landing} className="font-serif text-2xl font-bold text-brand-primary">
          Huaxia
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#sections"
            className="text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary"
          >
            Sections
          </a>

          <a
            href="#search"
            className="text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary"
          >
            Search
          </a>

          <a
            href="#workflow"
            className="text-sm font-bold text-brand-on-surface/60 transition hover:text-brand-primary"
          >
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.login}
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-brand-on-surface/60 transition hover:bg-brand-neutral-soft hover:text-brand-primary sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            to={ROUTES.register}
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-primary-hover"
          >
            Join Huaxia
          </Link>
        </div>
      </div>
    </header>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-brand-surface text-brand-on-surface">
      <LandingHeader />

      <main>
        <section className="relative px-4 pb-20 pt-28 md:px-6 md:pb-28">
          <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
          <div className="absolute right-10 top-52 hidden h-52 w-52 rounded-full bg-brand-accent/20 blur-3xl lg:block" />

          <div className="relative mx-auto max-w-[1280px]">
            <div className="mx-auto max-w-5xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-outline bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-primary shadow-sm"
              >
                <Globe2 className="h-4 w-4" />
                International student knowledge in China
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08 }}
                className="font-serif text-5xl font-bold leading-[0.95] tracking-tight text-brand-on-surface md:text-7xl lg:text-8xl"
              >
                Student life in China, searchable by meaning.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.16 }}
                className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-brand-on-surface/65 md:text-xl"
              >
                Huaxia helps international students ask questions, share experiences, browse
                thematic pages, and find practical answers through AI-assisted categorization and
                semantic search.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.24 }}
                className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
              >
                <Link
                  to={ROUTES.register}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-primary-hover"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to={ROUTES.login}
                  className="inline-flex items-center justify-center rounded-full border border-brand-outline bg-white px-7 py-4 text-sm font-black uppercase tracking-wide text-brand-primary transition hover:bg-brand-neutral-soft"
                >
                  Sign in
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="relative mx-auto mt-12 max-w-5xl"
            >
              <div className="absolute -inset-6 rounded-[2rem] bg-brand-primary/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-brand-outline bg-white shadow-2xl">
                <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="relative overflow-hidden bg-gradient-to-br from-brand-neutral-soft via-white to-brand-surface p-7 md:p-8">
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-outline bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-primary">
                          <Sparkles className="h-4 w-4" />
                          AI-assisted discovery
                        </div>

                        <h2 className="max-w-xl font-serif text-4xl font-bold leading-tight text-brand-on-surface md:text-5xl">
                          Find the student answer before the chat group disappears.
                        </h2>

                        <p className="mt-4 max-w-lg leading-7 text-brand-on-surface/65">
                          Huaxia turns scattered student experiences into searchable, organized
                          discussions for life in China.
                        </p>
                      </div>

                      <div className="mt-8 grid grid-cols-2 gap-3">
                        {[
                          ['4', 'thematic sections'],
                          ['AI', 'categorization'],
                          ['Search', 'by meaning'],
                          ['Real', 'student posts'],
                        ].map(([value, label]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-brand-outline bg-white/80 p-4"
                          >
                            <p className="font-serif text-3xl font-bold text-brand-primary">
                              {value}
                            </p>

                            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brand-on-surface/45">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-brand-outline bg-brand-on-surface p-6 text-white lg:border-l lg:border-t-0">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
                          Search preview
                        </p>

                        <h3 className="mt-1 font-serif text-2xl font-bold">Ask naturally</h3>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/45">Query</p>

                      <p className="mt-2 text-lg font-bold">
                        “How do I survive my first month in China?”
                      </p>
                    </div>

                    <div className="mt-5 space-y-3">
                      {searchExamples.map((example, index) => (
                        <div
                          key={example}
                          className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase text-white/70">
                              Result {index + 1}
                            </span>

                            <span className="text-xs font-bold text-brand-accent">
                              semantic match
                            </span>
                          </div>

                          <p className="text-sm font-semibold leading-6 text-white/85">
                            {example}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="sections" className="px-4 py-20 md:px-6">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
                  <BookOpen className="h-4 w-4" />
                  Thematic discovery
                </p>

                <h2 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
                  Browse the problems students actually have.
                </h2>
              </div>

              <p className="max-w-md text-brand-on-surface/60">
                Cities, universities, culture, and daily life are the core pages of Huaxia.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.title}
                    className="rounded-3xl border border-brand-outline bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-primary"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-brand-on-surface">
                      {section.title}
                    </h3>

                    <p className="mt-3 leading-7 text-brand-on-surface/60">
                      {section.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="search" className="px-4 py-20 md:px-6">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-brand-outline bg-white p-7 shadow-sm md:p-8">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
                <Search className="h-4 w-4" />
                Semantic search
              </p>

              <h2 className="font-serif text-4xl font-bold text-brand-on-surface">
                Search what you mean, not only what you type.
              </h2>

              <p className="mt-4 leading-7 text-brand-on-surface/65">
                Students describe the same problem in different words. Huaxia is designed around
                natural questions and relevance.
              </p>
            </div>

            <div className="rounded-3xl border border-brand-outline bg-brand-on-surface p-7 text-white shadow-sm md:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Sparkles className="h-6 w-6 text-brand-accent" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                    AI support
                  </p>

                  <h3 className="font-serif text-2xl font-bold">Organized knowledge</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  'AI category labels on posts',
                  'Summaries when available',
                  'Tags for faster scanning',
                  'Fallback if AI data is missing',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <CheckCircle2 className="mb-3 h-5 w-5 text-brand-accent" />

                    <p className="font-semibold leading-6 text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="px-4 py-20 md:px-6">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-10 text-center">
              <p className="mb-2 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
                <Users className="h-4 w-4" />
                Community workflow
              </p>

              <h2 className="font-serif text-4xl font-bold text-brand-on-surface md:text-5xl">
                Built around posting and searching.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {workflow.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-3xl border border-brand-outline bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="font-serif text-5xl font-bold text-brand-primary/20">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-brand-on-surface">
                      {step.title}
                    </h3>

                    <p className="mt-3 leading-7 text-brand-on-surface/60">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 pt-10 md:px-6">
          <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[2rem] bg-brand-primary p-8 text-white shadow-sm md:p-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white/60">
                  <ShieldCheck className="h-4 w-4" />
                  Ready for demo
                </p>

                <h2 className="max-w-2xl font-serif text-4xl font-bold md:text-5xl">
                  Start building the student knowledge base.
                </h2>

                <p className="mt-4 max-w-2xl text-white/75">
                  Create an account, enter the feed, and test the full MVP loop from posting to
                  search to post detail.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={ROUTES.register}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-black uppercase tracking-wide text-brand-primary transition hover:bg-brand-neutral-soft"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to={ROUTES.login}
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-outline px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 text-sm text-brand-on-surface/55 md:flex-row md:items-center md:justify-between">
          <p className="font-serif text-xl font-bold text-brand-primary">Huaxia</p>

          <p>AI-assisted community platform for international students in China.</p>
        </div>
      </footer>
    </div>
  );
}