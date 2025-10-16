'use client';

import { useState } from 'react';
import useAuth from '@/utils/useAuth';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function AccountSignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithCredentials } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('O nome é obrigatório');
      return;
    }

    if (!email.trim()) {
      setError('O email é obrigatório');
      return;
    }

    if (password.length < 8) {
      setError('A password deve ter pelo menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }

    setLoading(true);

    try {
      await signUpWithCredentials({
        email: email.trim(),
        password,
        name: name.trim(),
        callbackUrl: '/onboarding',
        redirect: true,
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError('Erro ao criar conta. O email pode já estar em uso.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/sign-in"
            className="text-[#6B7280] hover:text-[#0A0A0A] mb-4 text-sm flex items-center gap-2 transition-colors duration-150"
          >
            <ArrowLeft size={16} />
            Voltar ao Login
          </a>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-[#FF7A1A] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-3xl font-bold text-[#0A0A0A]">
              Criar Conta
            </h1>
            <p className="text-[#6B7280] mt-2">
              Junte-se ao EuroAI Hub e comece hoje
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0A0A0A] mb-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[#6B7280]" />
                  Nome Completo
                </div>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                placeholder="Insira o seu nome completo"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0A0A0A] mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#6B7280]" />
                  Email
                </div>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                placeholder="exemplo@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0A0A0A] mb-2">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-[#6B7280]" />
                  Password
                </div>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                placeholder="Mínimo 8 caracteres"
              />
              <p className="text-xs text-[#6B7280] mt-1">
                A password deve ter pelo menos 8 caracteres
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0A0A0A] mb-2">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-[#6B7280]" />
                  Confirmar Password
                </div>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors duration-150"
                placeholder="Confirme a sua password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF7A1A] hover:bg-[#E6691A] text-white font-semibold py-3 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'A criar conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Já tem uma conta?{' '}
              <a href="/sign-in" className="text-[#FF7A1A] hover:text-[#E6691A] font-medium transition-colors duration-150">
                Iniciar sessão
              </a>
            </p>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <p className="text-xs text-[#6B7280] text-center">
              Ao criar uma conta, concorda com os nossos{' '}
              <a href="#" className="text-[#FF7A1A] hover:text-[#E6691A] transition-colors duration-150">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-[#FF7A1A] hover:text-[#E6691A] transition-colors duration-150">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}