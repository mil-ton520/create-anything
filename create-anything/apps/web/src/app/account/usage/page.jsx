'use client';

import { useState, useEffect } from 'react';
import useUser from '@/utils/useUser';
import { BarChart3, TrendingUp, Zap, CreditCard, ArrowLeft, Crown } from 'lucide-react';

export default function UsageAndBillingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [workspace, setWorkspace] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && user) {
      loadUsageData();
    }
  }, [user, userLoading]);

  const loadUsageData = async () => {
    try {
      setLoading(true);
      
      // Load current workspace
      const wsResponse = await fetch('/api/workspaces');
      if (wsResponse.ok) {
        const wsData = await wsResponse.json();
        setWorkspace(wsData.workspaces[0]);
      }

      // Load usage data
      const usageResponse = await fetch('/api/usage');
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsage(usageData);
      }
    } catch (err) {
      console.error('Failed to load usage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanInfo = (plan) => {
    const plans = {
      free: {
        name: 'Free',
        color: 'bg-gray-500',
        price: '€0',
        features: ['1 workspace', '100 mensagens/mês', '1 membro'],
      },
      starter: {
        name: 'Starter',
        color: 'bg-blue-500',
        price: '€29',
        features: ['3 workspaces', '5,000 mensagens/mês', '10 membros'],
      },
      pro: {
        name: 'Pro',
        color: 'bg-[#FF7A1A]',
        price: '€99',
        features: ['Workspaces ilimitados', '50,000 mensagens/mês', '50 membros'],
      },
      enterprise: {
        name: 'Enterprise',
        color: 'bg-purple-600',
        price: 'Contactar',
        features: ['Tudo ilimitado', 'SLA garantido', 'Suporte dedicado'],
      },
    };
    return plans[plan || 'free'];
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-[#6B7280]">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-in';
    }
    return null;
  }

  const currentPlan = getPlanInfo(workspace?.plan);

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="text-[#6B7280] hover:text-[#0A0A0A] mb-4 text-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar ao Dashboard
          </a>
          <h1 className="text-3xl font-bold text-[#0A0A0A]">Uso e Cobrança</h1>
          <p className="text-[#6B7280] mt-2">
            Acompanhe o seu uso e gerencie a sua subscrição
          </p>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${currentPlan.color} rounded-xl flex items-center justify-center`}>
                <Crown size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A]">
                  Plano {currentPlan.name}
                </h2>
                <p className="text-[#6B7280]">{currentPlan.price}/mês</p>
                <ul className="mt-2 space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-[#6B7280] flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#FF7A1A] rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button className="px-6 py-3 bg-[#FF7A1A] text-white rounded-lg font-semibold hover:bg-[#E6691A]">
              Upgrade de Plano
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Messages Used */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#0A0A0A]">Mensagens</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0A0A0A]">
                  {usage?.messages || 0}
                </span>
                <span className="text-sm text-[#6B7280]">/ 5,000</span>
              </div>
              <div className="w-full bg-[#F4F5F7] rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(((usage?.messages || 0) / 5000) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-[#6B7280]">
                {5000 - (usage?.messages || 0)} mensagens restantes
              </p>
            </div>
          </div>

          {/* Token Usage */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-[#0A0A0A]">Tokens</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0A0A0A]">
                  {usage?.tokens || 0}
                </span>
                <span className="text-sm text-[#6B7280]">usados</span>
              </div>
              <p className="text-xs text-[#6B7280]">Este mês</p>
            </div>
          </div>

          {/* Cost */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard size={20} className="text-[#FF7A1A]" />
              </div>
              <h3 className="font-semibold text-[#0A0A0A]">Custo</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0A0A0A]">
                  €{((usage?.cost_cents || 0) / 100).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">Este mês</p>
            </div>
          </div>
        </div>

        {/* Usage History */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0A0A0A]">Histórico de Uso</h2>
              <p className="text-sm text-[#6B7280]">Últimos 30 dias</p>
            </div>
          </div>

          <div className="space-y-3">
            {usage?.history && usage.history.length > 0 ? (
              usage.history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[#0A0A0A]">{item.date}</p>
                    <p className="text-sm text-[#6B7280]">
                      {item.messages} mensagens • {item.tokens} tokens
                    </p>
                  </div>
                  <p className="font-semibold text-[#0A0A0A]">
                    €{(item.cost_cents / 100).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BarChart3 size={48} className="text-[#E5E7EB] mx-auto mb-4" />
                <p className="text-[#6B7280]">Nenhum histórico de uso disponível</p>
                <p className="text-sm text-[#6B7280] mt-1">
                  Comece a usar a plataforma para ver o seu histórico
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Available Plans */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">Planos Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['free', 'starter', 'pro', 'enterprise'].map((planKey) => {
              const plan = getPlanInfo(planKey);
              const isCurrent = workspace?.plan === planKey;
              return (
                <div
                  key={planKey}
                  className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                    isCurrent ? 'border-[#FF7A1A]' : 'border-[#E5E7EB]'
                  }`}
                >
                  {isCurrent && (
                    <div className="mb-3">
                      <span className="px-3 py-1 bg-[#FF7A1A] text-white text-xs font-semibold rounded-full">
                        Plano Atual
                      </span>
                    </div>
                  )}
                  <div className={`w-12 h-12 ${plan.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Crown size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold text-[#0A0A0A] mb-4">{plan.price}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-[#6B7280] flex items-center gap-2">
                        <span className="w-1 h-1 bg-[#FF7A1A] rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold ${
                      isCurrent
                        ? 'bg-[#F4F5F7] text-[#6B7280] cursor-not-allowed'
                        : 'bg-[#FF7A1A] text-white hover:bg-[#E6691A]'
                    }`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Atual' : 'Selecionar'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
