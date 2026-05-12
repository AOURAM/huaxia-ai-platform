import {
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Landmark,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Search,
  Sparkles,
  Tags,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const sections = [
  {
    title: 'Cities',
    description: 'Housing, transport, food, cost of living, and student survival tips by city.',
    icon: MapPin,
    href: ROUTES.cities,
    meta: 'City guides',
  },
  {
    title: 'Universities',
    description: 'Campus life, dormitories, registration, classes, offices, and study support.',
    icon: GraduationCap,
    href: ROUTES.universities,
    meta: 'Campus threads',
  },
  {
    title: 'Culture',
    description: 'Customs, festivals, etiquette, food culture, and daily communication.',
    icon: Landmark,
    href: ROUTES.culture,
    meta: 'Culture help',
  },
  {
    title: 'Daily Life',
    description: 'Banking, SIM cards, payments, hospitals, transport, renting, and paperwork.',
    icon: Building2,
    href: ROUTES.dailyLife,
    meta: 'Practical answers',
  },
];

const heroThreads = [
  {
    title: 'How do I open a bank account in China?',
    section: 'Daily Life',
    replies: 18,
    tag: 'banking',
    time: '12 min ago',
  },
  {
    title: 'Which city is cheaper for international students?',
    section: 'Cities',
    replies: 24,
    tag: 'cost of living',
    time: '28 min ago',
  },
  {
    title: 'What documents do I need for registration?',
    section: 'Universities',
    replies: 11,
    tag: 'registration',
    time: '1h ago',
  },
];

const searchExamples = [
  'first month in China checklist',
  'cheap city for students',
  'dormitory problem solution',
  'how to use Alipay as foreigner',
];

const liveQuestions = [
  'Can I rent outside campus?',
  'Where can I buy a SIM card?',
  'How do I renew my residence permit?',
  'What should I bring to university registration?',
  'How do students find halal food?',
  'How can I pay hospital fees?',
];

const stats = [
  {
    value: '4',
    label: 'main sections',
  },
  {
    value: 'AI',
    label: 'post sorting',
  },
  {
    value: '24/7',
    label: 'student questions',
  },
  {
    value: '∞',
    label: 'search meanings',
  },
];

const workflow = [
  {
    title: 'Ask or share',
    description: 'Students post questions, tips, guides, and real experiences from life in China.',
    icon: MessageSquareText,
  },
  {
    title: 'AI structures it',
    description: 'Huaxia adds categories, summaries, and tags so useful posts do not disappear.',
    icon: Brain,
  },
  {
    title: 'Search by meaning',
    description: 'Semantic search finds relevant answers even when the words are different.',
    icon: Search,
  },
];

const trustSignals = [
  'Student threads',
  'AI categories',
  'Topic tags',
  'Reply counts',
  'Fresh posts',
  'Readable discussions',
];

function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-outline/40 bg-brand-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link to={ROUTES.landing} className="flex items-center">
          <span className="text-3xl font-black tracking-[-0.06em] text-brand-on-surface">
            Huaxia
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-brand-on-surface/65 md:flex">
          <a href="#sections" className="transition hover:text-brand-primary">
            Sections
          </a>
          <a href="#search" className="transition hover:text-brand-primary">
            Search
          </a>
          <a href="#workflow" className="transition hover:text-brand-primary">
            Workflow
          </a>
          <a href="#community" className="transition hover:text-brand-primary">
            Community
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.login}
            className="hidden rounded-xl px-4 py-2 text-sm font-extrabold text-brand-primary transition hover:bg-brand-neutral-soft sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to={ROUTES.register}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-extrabold text-[#EDF2F4] shadow-sm transition hover:bg-brand-primary-hover"
          >
            Join
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function FloatingTopic({
  children,
  className = '',
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { duration: 5, delay, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 0.5, delay },
      }}
      className={`absolute rounded-full border border-brand-outline/50 bg-white/70 px-4 py-2 text-xs font-extrabold text-brand-on-surface shadow-sm backdrop-blur ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ThreadPreviewCard({
  title,
  section,
  replies,
  tag,
  time,
  index,
}: {
  title: string;
  section: string;
  replies: number;
  tag: string;
  time: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.25 + index * 0.12 }}
      className="rounded-2xl border border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.08] p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-brand-primary/20 px-3 py-1 text-xs font-extrabold text-[#EDF2F4]">
          {section}
        </span>
        <span className="flex items-center gap-1 text-xs font-bold text-[#EDF2F4]/45">
          <Clock3 size={13} />
          {time}
        </span>
      </div>

      <p className="text-sm font-extrabold leading-6 text-[#EDF2F4]">{title}</p>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-[#EDF2F4]/55">
        <span className="flex items-center gap-1">
          <MessageCircle size={14} />
          {replies} replies
        </span>
        <span className="flex items-center gap-1">
          <Tags size={14} />
          {tag}
        </span>
      </div>
    </motion.div>
  );
}

function SearchMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.15 }}
      className="relative z-10"
    >
      <div className="relative rounded-[2rem] border border-brand-outline/50 bg-white/75 p-4 shadow-2xl shadow-brand-primary/10 backdrop-blur">
        <FloatingTopic className="-left-8 top-10 hidden lg:block" delay={0.5}>
          Wuhan tips
        </FloatingTopic>
        <FloatingTopic className="-right-10 top-32 hidden lg:block" delay={0.8}>
          Visa help
        </FloatingTopic>
        <FloatingTopic className="-bottom-7 left-14 hidden lg:block" delay={1.1}>
          Dormitory
        </FloatingTopic>

        <div className="overflow-hidden rounded-[1.65rem] bg-brand-on-surface p-5 text-[#EDF2F4]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#EDF2F4]/40">
                Live search preview
              </p>
              <h2 className="mt-1 text-2xl font-extrabold text-[#EDF2F4]">Ask naturally</h2>
            </div>
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF2F4]/10"
            >
              <Search size={24} />
            </motion.div>
          </div>

          <div className="rounded-2xl border border-[#EDF2F4]/10 bg-[#EDF2F4]/10 p-4">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#EDF2F4]/40">
              Query
            </p>
            <p className="text-base font-bold leading-6 text-[#EDF2F4]">
              “How do I survive my first month in China?”
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {heroThreads.map((thread, index) => (
              <ThreadPreviewCard key={thread.title} {...thread} index={index} />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.07] p-4"
              >
                <p className="text-2xl font-black text-[#EDF2F4]">{stat.value}</p>
                <p className="mt-1 text-xs font-bold text-[#EDF2F4]/45">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MovingQuestionStrip() {
  const repeatedQuestions = [...liveQuestions, ...liveQuestions];

  return (
    <section className="overflow-hidden border-y border-brand-outline/40 bg-brand-on-surface py-4 text-[#EDF2F4]">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="flex w-max gap-3 px-5"
      >
        {repeatedQuestions.map((question, index) => (
          <div
            key={`${question}-${index}`}
            className="flex items-center gap-2 rounded-full border border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.08] px-4 py-2 text-sm font-bold text-[#EDF2F4]/75"
          >
            <Sparkles size={14} className="text-brand-primary" />
            {question}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-brand-surface font-sans text-brand-on-surface">
      <LandingHeader />

      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-primary/15 blur-3xl" />
        <div className="absolute right-[-170px] top-40 h-[360px] w-[360px] rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-160px] h-[420px] w-[420px] rounded-full bg-brand-on-surface/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.055em] text-brand-on-surface md:text-7xl lg:text-8xl">
              Ask.
              <br />
              Share.
              <br />
              Find faster.
            </h1>

            <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/68 md:text-xl">
              Huaxia turns scattered student questions into searchable threads, AI categories, and
              practical answers for international students living and studying in China.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTES.register}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-6 py-4 text-base font-black text-[#EDF2F4] shadow-lg shadow-brand-primary/20 transition hover:-translate-y-0.5 hover:bg-brand-primary-hover"
              >
                Start asking
                <ArrowRight size={18} />
              </Link>
              <a
                href="#sections"
                className="inline-flex items-center justify-center rounded-2xl border border-brand-outline bg-white/75 px-6 py-4 text-base font-black text-brand-on-surface shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-neutral-soft"
              >
                Browse topics
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-brand-outline/50 bg-white/60 px-3 py-2 text-xs font-extrabold text-brand-on-surface/65"
                >
                  {signal}
                </span>
              ))}
            </div>
          </motion.div>

          <SearchMockup />
        </div>
      </section>

      <MovingQuestionStrip />

      <section id="sections" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-primary">
              Thematic discovery
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">
              The four places where student problems actually live.
            </h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/62 lg:justify-self-end">
            No random mess. Huaxia keeps posts organized around cities, universities, culture, and
            daily life so users can browse before they even know what to search.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Link
                  to={section.href}
                  className="group relative block min-h-full overflow-hidden rounded-[1.7rem] border border-brand-outline/50 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-primary/50 hover:shadow-xl hover:shadow-brand-primary/10"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-primary/10 transition group-hover:scale-125" />

                  <div className="relative z-10">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary transition group-hover:bg-brand-primary group-hover:text-[#EDF2F4]">
                        <Icon size={24} />
                      </div>
                      <span className="rounded-full border border-brand-outline/50 bg-white/60 px-3 py-1 text-xs font-extrabold text-brand-on-surface/55">
                        {section.meta}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black tracking-[-0.03em] text-brand-on-surface">
                      {section.title}
                    </h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-brand-on-surface/62">
                      {section.description}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-primary">
                      Open section
                      <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="search" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-brand-outline/50 bg-brand-on-surface shadow-2xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative p-8 text-[#EDF2F4] md:p-10">
              <div className="absolute left-[-90px] top-[-90px] h-64 w-64 rounded-full bg-brand-primary/30 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF2F4]/10">
                  <Search size={28} />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#EDF2F4]/45">
                  Semantic search
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#EDF2F4] md:text-5xl">
                  Search what you mean, not only what you type.
                </h2>
                <p className="mt-5 text-lg font-medium leading-8 text-[#EDF2F4]/68">
                  Students describe the same problem with different words. Huaxia surfaces relevant
                  posts through meaning-based discovery and AI-organized context.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {[
                    ['Meaning', 'semantic match'],
                    ['Context', 'tags + section'],
                    ['Speed', 'fast discovery'],
                    ['Fallback', 'still readable'],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.08] p-4"
                    >
                      <p className="text-xl font-black text-[#EDF2F4]">{value}</p>
                      <p className="mt-1 text-xs font-bold text-[#EDF2F4]/45">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.06] p-5 md:p-8 lg:border-l lg:border-t-0">
              <div className="rounded-[1.5rem] border border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.08] p-4">
                <div className="flex items-center gap-3 rounded-2xl bg-[#EDF2F4]/10 px-4 py-4 text-[#EDF2F4]">
                  <Search size={20} className="shrink-0 text-[#EDF2F4]/55" />
                  <span className="text-sm font-bold text-[#EDF2F4]/70">
                    Search: “Where should I live near campus?”
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {searchExamples.map((example, index) => (
                    <motion.div
                      key={example}
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      className="rounded-2xl border border-[#EDF2F4]/10 bg-[#EDF2F4]/[0.08] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-[#EDF2F4]/38">
                          Result {index + 1}
                        </span>
                        <span className="rounded-full bg-brand-primary/20 px-3 py-1 text-xs font-black text-[#EDF2F4]">
                          semantic
                        </span>
                      </div>
                      <p className="text-sm font-bold leading-6 text-[#EDF2F4]/82">{example}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-primary">
            Community workflow
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-[-0.04em] md:text-5xl">
            A living forum, not a dead landing page.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/62">
            The landing page now shows the actual product loop: students post, AI organizes, search
            brings useful answers back.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {workflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="rounded-[1.7rem] border border-brand-outline/50 bg-white/70 p-6 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-neutral-soft text-brand-primary">
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-black text-brand-on-surface/30">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-brand-on-surface/62">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="community" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-brand-primary">
              Discussion energy
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">
              Make the page feel like students are already inside.
            </h2>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-brand-on-surface/62">
              A landing page for Huaxia cannot be empty and pretty. It needs visible questions,
              tags, replies, categories, and activity cues. That is what makes it feel alive.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                'Thread previews',
                'Author-style metadata',
                'Reply counters',
                'Topic chips',
                'AI status labels',
                'Search-first layout',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-brand-outline/50 bg-white/70 p-4 text-sm font-black text-brand-on-surface/72 shadow-sm"
                >
                  <CheckCircle2 className="shrink-0 text-brand-primary" size={20} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-outline/50 bg-white/75 p-5 shadow-xl shadow-brand-primary/10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-primary">
                  Active now
                </p>
                <h3 className="mt-1 text-2xl font-black tracking-[-0.03em]">
                  Student questions
                </h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary text-[#EDF2F4]">
                <Zap size={21} />
              </div>
            </div>

            <div className="space-y-3">
              {heroThreads.map((thread) => (
                <div
                  key={thread.title}
                  className="rounded-2xl border border-brand-outline/50 bg-brand-surface p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-black text-brand-primary">
                      {thread.section}
                    </span>
                    <span className="text-xs font-bold text-brand-on-surface/45">
                      {thread.time}
                    </span>
                  </div>
                  <p className="text-sm font-black leading-6 text-brand-on-surface">
                    {thread.title}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-bold text-brand-on-surface/50">
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {thread.replies} replies
                    </span>
                    <span className="flex items-center gap-1">
                      <Tags size={14} />
                      {thread.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={ROUTES.register}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-4 text-sm font-black text-[#EDF2F4] transition hover:bg-brand-primary-hover"
            >
              Join the discussion
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-on-surface p-8 text-[#EDF2F4] shadow-2xl md:p-12">
          <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-brand-primary/30 blur-3xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#EDF2F4]/42">
                Ready for demo
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#EDF2F4] md:text-5xl">
                Start building the student knowledge base.
              </h2>
              <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-[#EDF2F4]/65">
                Test the full MVP loop: onboarding, post creation, AI tags, semantic search, post
                detail, comments, and reactions.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to={ROUTES.register}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EDF2F4] px-6 py-4 text-base font-black text-[#2B2D42] transition hover:bg-[#EDF2F4]/90"
              >
                Create account
                <ArrowRight size={18} />
              </Link>
              <Link
                to={ROUTES.login}
                className="inline-flex items-center justify-center rounded-2xl border border-[#EDF2F4]/20 px-6 py-4 text-base font-black text-[#EDF2F4] transition hover:bg-[#EDF2F4]/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-outline/40 px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm font-semibold text-brand-on-surface/50 md:flex-row">
          <div className="flex items-center gap-2 font-black text-brand-on-surface">
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