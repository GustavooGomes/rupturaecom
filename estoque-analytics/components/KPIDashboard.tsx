'use client';

import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle } from 'lucide-react';
import { Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
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



  // Métricas operacionais baseadas nos dados reais do Excel
  const operationalMetrics = [
    {
      title: 'Nível de Serviço',
      value: performanceMetrics.fillRate,
      unit: '%',
      target: 95,
      icon: Target,
      color: 'green',
      explanation: 'Percentual de produtos com estoque disponível (não zerado)'
    },
    {
      title: 'Giro Médio de Inventário',
      value: performanceMetrics.inventoryTurnover,
      unit: 'x/ano',
      target: 6,
      icon: TrendingUp,
      color: 'purple',
      explanation: 'Quantas vezes o estoque gira por ano baseado nas vendas dos últimos 30 dias'
    },
    {
      title: 'Dias Médios de Cobertura',
      value: performanceMetrics.daysOfInventory,
      unit: 'dias',
      target: 45,
      icon: TrendingDown,
      color: 'orange',
      explanation: 'Média de dias que o estoque atual consegue cobrir baseado no ritmo de vendas'
    },
    {
      title: 'Taxa de Ruptura',
      value: 100 - performanceMetrics.fillRate,
      unit: '%',
      target: 5,
      icon: AlertTriangle,
      color: 'red',
      explanation: 'Percentual de produtos em ruptura (estoque zerado)'
    }
  ];

  // Remover métricas que não podemos calcular com os dados do Excel atual

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
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="85%" data={radialData}>
                <RadialBar
                  dataKey="value"
                  cornerRadius={3}
                  fill="#8884d8"
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Performance']}
                  labelFormatter={(label: string) => `KPI: ${label}`}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Lista detalhada dos KPIs */}
            <div className="mt-4 space-y-2">
              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Detalhamento de Performance
              </h5>
              {radialData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {item.value.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.value >= 95 ? '✓ No alvo' : item.value >= 80 ? '⚠ Atenção' : '✗ Abaixo'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                
                {/* Explicação da métrica */}
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                  {metric.explanation}
                </div>
              </div>
            );
          })}
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