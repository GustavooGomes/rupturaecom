'use client';

import { BarChart3, Bed, Shirt, Brain, AlertTriangle, Target } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'travesseiros' | 'linha-branca' | 'analytics' | 'alerts' | 'kpis';
  onTabChange: (tab: 'dashboard' | 'travesseiros' | 'linha-branca' | 'analytics' | 'alerts' | 'kpis') => void;
  travesseiroCount: number;
  linhaBrancaCount: number;
  alertsCount?: number;
}

export const Navigation = ({ 
  activeTab, 
  onTabChange, 
  travesseiroCount, 
  linhaBrancaCount,
  alertsCount = 0
}: NavigationProps) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard Geral',
      icon: BarChart3,
      count: null
    },
    {
      id: 'analytics' as const,
      label: 'Análises Avançadas',
      icon: Brain,
      count: null
    },
    {
      id: 'kpis' as const,
      label: 'KPIs & Performance',
      icon: Target,
      count: null
    },
    {
      id: 'alerts' as const,
      label: 'Alertas',
      icon: AlertTriangle,
      count: alertsCount,
      urgent: alertsCount > 0
    },
    {
      id: 'travesseiros' as const,
      label: 'Travesseiros',
      icon: Bed,
      count: travesseiroCount
    },
    {
      id: 'linha-branca' as const,
      label: 'Linha Branca',
      icon: Shirt,
      count: linhaBrancaCount
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`
                      ml-2 py-0.5 px-2 rounded-full text-xs font-medium
                      ${isActive
                        ? 'bg-blue-100 text-blue-800'
                        : tab.urgent && tab.count > 0
                        ? 'bg-red-100 text-red-800 animate-pulse'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};