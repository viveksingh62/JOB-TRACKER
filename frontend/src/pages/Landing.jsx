import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BarChart3, Shield, Zap, FileSearch, Target, TrendingUp } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
  },
};

const features = [
  {
    icon: FileSearch,
    title: 'Smart Resume Parsing',
    desc: 'AI extracts and analyzes every detail from your resume in seconds.',
  },
  {
    icon: Target,
    title: 'Keyword Matching',
    desc: 'Instantly see which skills match the job and which are missing.',
  },
  {
    icon: TrendingUp,
    title: 'Score & Improve',
    desc: 'Get an actionable score with tailored suggestions to boost your fit.',
  },
];

const stats = [
  { value: '< 30s', label: 'Analysis Time' },
  { value: '100%', label: 'Free to Use' },
  { value: 'AI', label: 'Powered by Groq' },
  { value: '∞', label: 'Analyses Available' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />
        {/* Grid subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
            <Sparkles size={18} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Hire<span className="text-[var(--color-accent)]">IQ</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analyze"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-[var(--color-accent)] rounded-xl hover:bg-[var(--color-accent-hover)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(245,197,24,0.3)]"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-6xl mx-auto px-6 pt-20 md:pt-32 pb-20 text-center"
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm"
        >
          <Sparkles size={14} className="text-[var(--color-accent)]" />
          AI-Powered Resume Intelligence
          <ArrowRight size={14} />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          <span className="gradient-text">Land Your Dream</span>
          <br />
          <span className="text-white">Job, </span>
          <span className="text-[var(--color-accent)]">Faster</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed"
        >
          Upload your resume, paste a job description, and let our AI reveal exactly
          how well you match — with actionable insights to close the gap.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/analyze"
            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-[var(--color-accent)] rounded-2xl hover:bg-[var(--color-accent-hover)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,197,24,0.25)] hover:-translate-y-0.5"
          >
            Analyze Your Resume
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/15 rounded-2xl hover:bg-white/[0.06] transition-all duration-300"
          >
            View Dashboard
          </Link>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          {...floatingAnimation}
          className="absolute top-20 right-10 md:right-20 w-2 h-2 rounded-full bg-[var(--color-accent)]/60"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-40 left-10 md:left-20 w-3 h-3 rounded-full bg-emerald-400/40"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 left-1/4 w-1.5 h-1.5 rounded-full bg-white/20"
        />
      </motion.section>

      {/* Stats Strip */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 border-y border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        id="features"
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-24"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-[var(--color-accent)]">Stand Out</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Powerful tools designed to give you a competitive edge in your job search.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card-dark p-8 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-5 group-hover:bg-[var(--color-accent)]/20 transition-colors">
                <feature.icon size={22} className="text-[var(--color-accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Three Steps to <span className="text-[var(--color-accent)]">Success</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From upload to improvement — streamlined for speed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF resume into our secure analyzer.' },
            { step: '02', title: 'Add Job Details', desc: 'Paste the job description and enter the role and company.' },
            { step: '03', title: 'Get Insights', desc: 'Receive your match score, keyword gaps, and improvement tips instantly.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="relative"
            >
              <div className="text-6xl font-bold text-white/[0.04] mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold text-white mb-2 -mt-8">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 text-gray-600">
                  <ArrowRight size={20} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 py-24"
      >
        <div className="glass-card-dark p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
            Ready to Beat the Competition?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto relative z-10">
            Join thousands of job seekers who use HireIQ to tailor every application and land more interviews.
          </p>
          <Link
            to="/analyze"
            className="relative z-10 inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-[var(--color-accent)] rounded-2xl hover:bg-[var(--color-accent-hover)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(245,197,24,0.25)]"
          >
            Start Analyzing
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--color-accent)]" />
            <span className="text-sm font-semibold">HireIQ</span>
          </div>
          <p className="text-xs text-gray-500">© 2026 HireIQ. Built to boost your career.</p>
        </div>
      </footer>
    </div>
  );
}
