'use client';

import { useState } from 'react';
import useAuth from '@/utils/useAuth';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithCredentials } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: '/onboarding',
        redirect: true,
      });
    } catch (err) {
      setError('Failed to create account. Email may already be in use.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#FF7A1A] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">
            Join EuroAI Hub
          </h1>
          <p className="text-[#6B7280] mt-2">
            Create your account to get started
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0A0A0A] mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0A0A0A] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0A0A0A] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF7A1A] hover:bg-[#E6691A] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Already have an account?{' '}
              <a href="/sign-in" className="text-[#FF7A1A] hover:text-[#E6691A] font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
