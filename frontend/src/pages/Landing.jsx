import { useEffect, useState } from 'react';
import { ArrowRight, FileText, ListChecks, TrendingUp, Check, X } from 'lucide-react';
import  Dashboard  from '../pages/Dashboard.jsx';
import Analyze from '../pages/Analyze.jsx';
import { Link } from 'react-router-dom';
// ---- Design tokens (HireIQ: paper / document aesthetic, not glow-and-gradient) ----
const c = {
  bg: '#F6F5F1',
  surface: '#FFFFFF',
  ink: '#1B1D1F',
  inkSoft: '#5B5F63',
  inkFaint: '#9C9A92',
  border: '#DEDCD4',
  primary: '#1F4B3F',
  primaryHover: '#163629',
  primaryTint: '#E4ECE8',
  accent: '#D9A441',
  accentTint: '#FBF0D6',
  danger: '#B4463A',
  dangerTint: '#F5E6E3',
};

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);
  return mounted;
}

function Eyebrow({ children }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-4"
      style={{ fontFamily: "'IBM Plex Mono', monospace", color: c.primary, letterSpacing: '0.12em' }}
    >
      <span className="w-4 h-px" style={{ backgroundColor: c.primary }} />
      {children}
    </div>
  );
}

function ScoreRing({ score = 82 }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke={c.border} strokeWidth="6" />
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={c.primary}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 44 44)"
      />
      <text
        x="44"
        y="41"
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill={c.ink}
        style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        {score}
      </text>
      <text
        x="44"
        y="56"
        textAnchor="middle"
        fontSize="8"
        fill={c.inkFaint}
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        / 100
      </text>
    </svg>
  );
}

function ReportCard() {
  return (
    <div
      className="rounded-lg border p-6 md:p-7"
      style={{ backgroundColor: c.surface, borderColor: c.border, boxShadow: '0 1px 2px rgba(27,29,31,0.04), 0 12px 24px -12px rgba(27,29,31,0.10)' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div
            className="text-xs uppercase tracking-wide mb-1"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: c.inkFaint, letterSpacing: '0.08em' }}
          >
            Match report
          </div>
          <div className="text-sm" style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Frontend Engineer — Series B startup
          </div>
        </div>
        <ScoreRing score={82} />
      </div>

      <div
        className="text-sm leading-relaxed mb-5 pb-5 border-b"
        style={{ color: c.inkSoft, borderColor: c.border, fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Built and deployed a full-stack platform using{' '}
        <mark style={{ backgroundColor: c.accentTint, color: c.ink, padding: '0 3px', borderRadius: '2px' }}>React</mark>{' '}
        and{' '}
        <mark style={{ backgroundColor: c.accentTint, color: c.ink, padding: '0 3px', borderRadius: '2px' }}>Node.js</mark>
        , with a{' '}
        <mark style={{ backgroundColor: c.accentTint, color: c.ink, padding: '0 3px', borderRadius: '2px' }}>Redis</mark>
        -backed caching layer that cut API response time by 40%.
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <div
            className="text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: c.primary, letterSpacing: '0.06em' }}
          >
            <Check size={12} strokeWidth={2.5} /> Matched
          </div>
          <ul className="space-y-1.5">
            {['React', 'Node.js', 'Redis', 'REST APIs'].map((s) => (
              <li key={s} className="text-sm" style={{ color: c.ink, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div
            className="text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: c.danger, letterSpacing: '0.06em' }}
          >
            <X size={12} strokeWidth={2.5} /> Missing
          </div>
          <ul className="space-y-1.5">
            {['Docker', 'AWS'].map((s) => (
              <li key={s} className="text-sm" style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: FileText,
    title: 'Resume parsing',
    desc: 'Extracts skills, roles, and dates from any resume format in seconds.',
  },
  {
    icon: ListChecks,
    title: 'Keyword matching',
    desc: 'Compares your resume against the job description line by line.',
  },
  {
    icon: TrendingUp,
    title: 'Scored feedback',
    desc: 'A match score plus specific edits to close the gap before you apply.',
  },
];

const steps = [
  { n: '01', title: 'Add your resume', desc: 'Upload a PDF or paste your resume text directly.' },
  { n: '02', title: 'Paste the job post', desc: 'Drop in the job description you want to match against.' },
  { n: '03', title: 'Read the report', desc: 'Get your score, matched keywords, and what to fix first.' },
];

export default function Landing() {
  const mounted = useMounted();

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.bg, color: c.ink }}>
      <style>{fontImport}</style>

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-xl font-semibold"
            style={{ fontFamily: "'Source Serif 4', serif", color: c.ink }}
          >
            HireIQ
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm transition-colors"
            style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm transition-colors"
            style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            How it works
          </a>
        </div>
        <Link
          to="/Analyze"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{ backgroundColor: c.primary, color: '#FFFFFF', fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          Get started
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <Eyebrow>Resume → job match</Eyebrow>
            <h1
              className="text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.12] font-medium mb-6"
              style={{ fontFamily: "'Source Serif 4', serif", color: c.ink }}
            >
              Know if you're a fit
              <br />
              before you apply.
            </h1>
            <p
              className="text-base md:text-lg mb-8 max-w-md leading-relaxed"
              style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Paste your resume and a job description. HireIQ shows you exactly what
              matches, what's missing, and what to fix — in under 30 seconds.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/Analyze"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold transition-colors"
                style={{ backgroundColor: c.primary, color: '#FFFFFF', fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                Analyze your resume
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium underline underline-offset-4"
                style={{ color: c.ink, fontFamily: "'IBM Plex Sans', sans-serif", textDecorationColor: c.border }}
              >
                See how it works
              </a>
            </div>
          </div>

          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s',
            }}
          >
            <ReportCard />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y" style={{ borderColor: c.border }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ['< 30s', 'per analysis'],
            ['100%', 'free to use'],
            ['Groq', 'Llama 3.3 70B'],
            ['No limit', 'on analyses'],
          ].map(([value, label]) => (
            <div key={label}>
              <div
                className="text-lg font-semibold"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: c.primary }}
              >
                {value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: c.inkFaint, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="max-w-lg mb-14">
          <Eyebrow>What it does</Eyebrow>
          <h2
            className="text-2xl md:text-3xl font-medium mb-3"
            style={{ fontFamily: "'Source Serif 4', serif", color: c.ink }}
          >
            Everything between resume and interview.
          </h2>
          <p style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            No dashboards to learn, no account required to see your first result.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
          {features.map((f) => (
            <div key={f.title}>
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                style={{ backgroundColor: c.primaryTint }}
              >
                <f.icon size={18} style={{ color: c.primary }} />
              </div>
              <h3
                className="text-base font-semibold mb-1.5"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: c.ink }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t" style={{ borderColor: c.border, backgroundColor: c.surface }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
          <div className="max-w-lg mb-14">
            <Eyebrow>The process</Eyebrow>
            <h2
              className="text-2xl md:text-3xl font-medium"
              style={{ fontFamily: "'Source Serif 4', serif", color: c.ink }}
            >
              Three steps, one report.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.n} className="pt-5 border-t" style={{ borderColor: c.border }}>
                <div
                  className="text-xs mb-3"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: c.inkFaint }}
                >
                  {s.n}
                </div>
                <h3
                  className="text-base font-semibold mb-1.5"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: c.ink }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24">
        <div
          className="rounded-lg border px-8 py-12 md:px-14 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ borderColor: c.border, backgroundColor: c.surface }}
        >
          <div>
            <h2
              className="text-2xl md:text-3xl font-medium mb-2"
              style={{ fontFamily: "'Source Serif 4', serif", color: c.ink }}
            >
              Check your next application.
            </h2>
            <p style={{ color: c.inkSoft, fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Free, no sign-up, results in under a minute.
            </p>
          </div>
          <Link
        to="/Analyze"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors"
            style={{ backgroundColor: c.primary, color: '#FFFFFF', fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Analyze your resume
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: c.border }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "'Source Serif 4', serif", color: c.ink }}
          >
            HireIQ
          </span>
          <p className="text-xs" style={{ color: c.inkFaint, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            © 2026 HireIQ. Built to get you to the interview.
          </p>
        </div>
      </footer>
    </div>
  );
}