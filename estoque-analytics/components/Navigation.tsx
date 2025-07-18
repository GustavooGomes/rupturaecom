'use client';

import { BarChart3, Bed, Shirt } from 'lucide-react';

interface NavigationProps {
  activeTab: 'dashboard' | 'travesseiros' | 'linha-branca';
  onTabChange: (tab: 'dashboard' | 'travesseiros' | 'linha-branca') => void;
  travesseiroCount: number;
  linhaBrancaCount: number;
}

export const Navigation = ({ 
  activeTab, 
  onTabChange, 
  travesseiroCount, 
  linhaBrancaCount 
}: NavigationProps) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard Geral',
      icon: BarChart3,
      count: null
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