import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/analyze';

  if (user) return <Navigate to={destination} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const authenticate = mode === 'login' ? login : register;
      await authenticate({ email, password });
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not authenticate. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">← HireIQ</Link>
        <h1 className="text-2xl font-bold mt-6">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="text-sm text-gray-500 mt-2">{mode === 'login' ? 'Sign in to continue to your workspace.' : 'Create an account to save and manage your applications.'}</p>
        <label className="block text-sm font-medium mt-6">Email
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-700" />
        </label>
        <label className="block text-sm font-medium mt-4">Password
          <input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-700" />
        </label>
        {error && <p role="alert" className="text-sm text-red-600 mt-4">{error}</p>}
        <button disabled={busy} className="w-full mt-6 rounded-lg bg-[#1F4B3F] text-white py-2.5 font-medium disabled:opacity-60">
          {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
        <p className="text-sm text-center text-gray-500 mt-5">
          {mode === 'login' ? 'New to HireIQ?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="font-semibold text-[#1F4B3F]">
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </form>
    </main>
  );
}
