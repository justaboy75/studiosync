"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ENDPOINTS } from '@/config/api';

export default function SetupPassword() {
  const { user, login } = useAuth();
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validazione semplice
  const isPasswordValid = password.length >= 8;
  const doPasswordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return setError('Password must be at least 8 characters.');
    if (!doPasswordsMatch) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.SETUP_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          user_id: user?.id,
          new_password: password
        })
      });
      const result = await res.json();

      if (result.status === 'success') {
        // Aggiorniamo l'utente nel context (ora è attivo!)
        if (user) {
          login({ ...user, is_active: true });
        }
        router.push('/');
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Set your password</h1>
        <p className="text-slate-500 mb-6">Welcome! Please choose a secure password to activate your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Min. 8 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 block w-full border rounded-lg p-3 outline-none transition-colors ${
                confirmPassword && !doPasswordsMatch ? 'border-red-500' : 'border-slate-300 focus:ring-2 focus:ring-indigo-500'
              }`}
              placeholder="Repeat password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isPasswordValid || !doPasswordsMatch}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Activating account...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}