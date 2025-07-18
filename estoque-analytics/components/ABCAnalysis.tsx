'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, CheckCircle, AlertCircle } from 'lucide-react';
import { ABCAnalysisResult } from '@/types/product';

interface ABCAnalysisProps {
  abcResults: ABCAnalysisResult[];
}

export const ABCAnalysis = ({ abcResults }: ABCAnalysisProps) => {
  const [selectedClassification, setSelectedClassification] = useState<'A' | 'B' | 'C'>('A');

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'A': return '#10B981'; // Verde
      case 'B': return '#F59E0B'; // Amarelo
      case 'C': return '#EF4444'; // Vermelho
      default: return '#6B7280';
    }
  };

  const getClassificationDescription = (classification: string) => {
    switch (classification) {
      case 'A': return 'Alta importância - 80% do valor com 20% dos itens';
      case 'B': return 'Importância média - 15% do valor com 30% dos itens';
      case 'C': return 'Baixa importância - 5% do valor com 50% dos itens';
      default: return '';
    }
  };

  // Dados para o gráfico de pizza
  const pieData = abcResults.map(result => ({
    name: `Classe ${result.classification}`,
    value: result.totalValue,
    classification: result.classification,
    count: result.products.length,
    percentage: result.percentage
  }));

  // Dados para o gráfico de barras
  const barData = abcResults.map(result => ({
    classification: `Classe ${result.classification}`,
    valor: result.totalValue,
    produtos: result.products.length,
    percentual: result.percentage
  }));

  const selectedResult = abcResults.find(r => r.classification === selectedClassification);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análise ABC - Classificação de Produtos
        </h3>
        
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {abcResults.map((result) => (
            <div
              key={result.classification}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedClassification === result.classification
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedClassification(result.classification)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold" style={{ color: getClassificationColor(result.classification) }}>
                  Classe {result.classification}
                </span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getClassificationColor(result.classification) }} />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {getClassificationDescription(result.classification)}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Produtos:</span>
                  <span className="font-medium">{result.products.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Valor Total:</span>
                  <span className="font-medium">R$ {result.totalValue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>% do Portfolio:</span>
                  <span className="font-medium">{result.percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Distribuição por Valor</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getClassificationColor(entry.classification)} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR')}`,
                    'Valor'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Comparativo de Classes</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="classification" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString('pt-BR')} />
                <Bar dataKey="valor" fill="#3B82F6" name="Valor (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detalhes da classe selecionada */}
      {selectedResult && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Detalhes da Classe {selectedResult.classification}
              </h4>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: getClassificationColor(selectedResult.classification) }}
              >
                {selectedResult.products.length} produtos
              </span>
            </div>
          </div>

          {/* Recomendações estratégicas */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Recomendações Estratégicas
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top produtos da classe */}
          <div className="p-6">
            <h5 className="text-sm font-medium text-gray-700 mb-4">
              Top 10 Produtos da Classe {selectedResult.classification}
            </h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendas 30d
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risco
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedResult.products.slice(0, 10).map((product, index) => {
                    const valorTotal = product['Venda 30d'] * product.Preço;
                    return (
                      <tr key={`${product['ID VTEX']}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product['Nome Produto']}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.Tamanho}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product['Venda 30d'].toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {valorTotal.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.Estoque.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.risco === 'CRÍTICO' ? 'bg-red-100 text-red-800' :
                            product.risco === 'ALTO' ? 'bg-orange-100 text-orange-800' :
                            product.risco === 'MÉDIO' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.risco === 'CRÍTICO' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {product.risco}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.giroEstoque.toFixed(1)}x
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};