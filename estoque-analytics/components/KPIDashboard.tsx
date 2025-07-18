'use client';

import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle } from 'lucide-react';
import { LineChart, Line, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { KPITarget, PerformanceMetrics } from '@/types/product';

interface KPIDashboardProps {
  kpiTargets: KPITarget[];
  performanceMetrics: PerformanceMetrics;
}

export const KPIDashboard = ({ kpiTargets, performanceMetrics }: KPIDashboardProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'POSITIVA': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'NEGATIVA': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance >= 0) return 'text-green-600';
    if (variance >= -5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 95) return '#10B981'; // Verde
    if (percentage >= 80) return '#F59E0B'; // Amarelo
    return '#EF4444'; // Vermelho
  };

  // Dados para o gráfico radial dos KPIs
  const radialData = kpiTargets.map(kpi => ({
    name: kpi.metric,
    value: (kpi.current / kpi.target) * 100,
    fill: getPerformanceColor(kpi.current, kpi.target)
  }));

  // Simulação de dados históricos para tendências
  const generateTrendData = (current: number) => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 10;
      data.push({
        day: `${i}d`,
        value: Math.max(0, current + variation - i * 2)
      });
    }
    return data;
  };

  // Métricas operacionais em cards
  const operationalMetrics = [
    {
      title: 'Acurácia de Estoque',
      value: performanceMetrics.stockAccuracy,
      unit: '%',
      target: 98,
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Taxa de Atendimento',
      value: performanceMetrics.fillRate,
      unit: '%',
      target: 95,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Giro de Inventário',
      value: performanceMetrics.inventoryTurnover,
      unit: 'x',
      target: 12,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Dias de Inventário',
      value: performanceMetrics.daysOfInventory,
      unit: 'dias',
      target: 30,
      icon: TrendingDown,
      color: 'orange'
    }
  ];

  const advancedMetrics = [
    {
      title: 'Capital em Inventário',
      value: performanceMetrics.cashToInventory * 100,
      unit: '%',
      description: 'Percentual do capital investido em estoque'
    },
    {
      title: 'Inventário Obsoleto',
      value: performanceMetrics.obsoleteInventory * 100,
      unit: '%',
      description: 'Produtos com baixo giro ou sem movimento'
    },
    {
      title: 'Shrinkage',
      value: performanceMetrics.shrinkage * 100,
      unit: '%',
      description: 'Perda de inventário (quebra, furto, etc.)'
    },
    {
      title: 'Acurácia de Previsão',
      value: performanceMetrics.demandForecastAccuracy,
      unit: '%',
      description: 'Precisão das previsões de demanda'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Principais com Metas */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          KPIs Estratégicos vs Metas
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de KPIs */}
          <div className="space-y-4">
            {kpiTargets.map((kpi, index) => {
              const performance = (kpi.current / kpi.target) * 100;
              const isOnTarget = Math.abs(kpi.variance) <= 2;
              
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{kpi.metric}</h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(kpi.trend)}
                      {!isOnTarget && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {kpi.current.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Meta: {kpi.target.toFixed(1)}
                    </span>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, performance)}%`,
                        backgroundColor: getPerformanceColor(kpi.current, kpi.target)
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${getVarianceColor(kpi.variance)}`}>
                      {kpi.variance > 0 ? '+' : ''}{kpi.variance.toFixed(1)} vs meta
                    </span>
                    <span className="text-gray-500">
                      {performance.toFixed(1)}% da meta
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gráfico Radial de Performance */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Performance vs Metas</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  dataKey="value"
                />
                <Legend iconSize={10} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Métricas Operacionais */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Métricas Operacionais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {operationalMetrics.map((metric, index) => {
            const performance = (metric.value / metric.target) * 100;
            const isOnTarget = performance >= 95;
            
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`w-6 h-6 text-${metric.color}-500`} />
                  {isOnTarget ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
                
                <h4 className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </h4>
                
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Meta: {metric.target}</span>
                  <span className={`font-medium ${
                    performance >= 95 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {performance.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Métricas Avançadas */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Métricas Avançadas de Inventário
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedMetrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{metric.title}</h4>
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value.toFixed(1)}{metric.unit}
                </span>
              </div>
              <p className="text-sm text-gray-600">{metric.description}</p>
              
              {/* Gráfico de tendência simples */}
              <div className="mt-3">
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart data={generateTrendData(metric.value)}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo de Performance */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Resumo de Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {kpiTargets.filter(kpi => Math.abs(kpi.variance) <= 2).length}
            </div>
            <div className="text-sm opacity-90">KPIs no Alvo</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {((operationalMetrics.reduce((sum, m) => sum + (m.value / m.target), 0) / operationalMetrics.length) * 100).toFixed(0)}%
            </div>
            <div className="text-sm opacity-90">Performance Média</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {kpiTargets.filter(kpi => kpi.trend === 'POSITIVA').length}
            </div>
            <div className="text-sm opacity-90">Tendências Positivas</div>
          </div>
        </div>
      </div>
    </div>
  );
};