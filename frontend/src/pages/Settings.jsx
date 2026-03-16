import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Moon, Save, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  // load on mount
  useEffect(() => {
    const stored = localStorage.getItem('hireiq_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
      setNotifications(parsed.notifications ?? true);
      if (parsed.darkMode) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSave = () => {
    localStorage.setItem(
      'hireiq_settings',
      JSON.stringify({ name, email, notifications, darkMode })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your profile and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl border border-[var(--color-border)] p-6 md:p-8 mb-6"
      >
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <User size={18} className="text-[var(--color-text-muted)]" />
          Profile
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field"
            />
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl border border-[var(--color-border)] p-6 md:p-8 mb-6"
      >
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">Preferences</h2>
        <div className="space-y-5">

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Bell size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Email Notifications</p>
                <p className="text-xs text-[var(--color-text-muted)]">Get notified about application updates</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${notifications ? 'bg-[var(--color-accent)]' : 'bg-gray-200'}`}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                animate={{ left: notifications ? '24px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <Moon size={16} className="text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Dark Mode</p>
                <p className="text-xs text-[var(--color-text-muted)]">Switch to a darker color scheme</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${darkMode ? 'bg-[var(--color-accent)]' : 'bg-gray-200'}`}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                animate={{ left: darkMode ? '24px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

        </div>
      </motion.div>

      {/* Save */}
      <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          Save Settings
        </motion.button>
        {saved && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            Settings saved!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}