export async function GET() {
  try {
    const models = [
      {
        id: 'auto',
        name: 'Auto Mode',
        provider: 'smart_routing',
        icon: '🤖',
        badge: 'Inteligente',
        description: 'Escolhe automaticamente o melhor modelo',
        speedMultiplier: 1,
        capabilities: ['text', 'vision'],
        color: '#FF7A1A'
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        icon: '🟢',
        badge: 'Rápido',
        description: 'Modelo rápido e eficiente para tarefas gerais',
        speedMultiplier: 1,
        capabilities: ['text', 'vision'],
        color: '#00A67E'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        icon: '🟢',
        badge: 'Poderoso',
        description: 'Modelo mais avançado para tarefas complexas',
        speedMultiplier: 3,
        capabilities: ['text'],
        color: '#00A67E'
      },
      {
        id: 'claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        icon: '🟣',
        badge: 'Equilibrado',
        description: 'Excelente para análise e raciocínio',
        speedMultiplier: 1.5,
        capabilities: ['text', 'vision'],
        color: '#8B5CF6'
      },
      {
        id: 'claude-opus',
        name: 'Claude Opus',
        provider: 'anthropic',
        icon: '🟣',
        badge: 'Poderoso',
        description: 'O mais avançado para tarefas críticas',
        speedMultiplier: 4,
        capabilities: ['text'],
        color: '#8B5CF6'
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'google',
        icon: '🔵',
        badge: 'Muito Rápido',
        description: 'Ultra-rápido para respostas imediatas',
        speedMultiplier: 0.5,
        capabilities: ['text', 'vision'],
        color: '#4285F4'
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        icon: '🔵',
        badge: 'Equilibrado',
        description: 'Versátil para múltiplas tarefas',
        speedMultiplier: 1,
        capabilities: ['text', 'vision'],
        color: '#4285F4'
      }
    ];

    return Response.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    return Response.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}