'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Product } from '@/types/product';

interface ChartsProps {
  products: Product[];
}

export const StockByTypeChart = ({ products }: ChartsProps) => {
  const data = useMemo(() => {
    const groupedData = products.reduce((acc, product) => {
      const type = product['Tipo. Produto'] || 'Outros';
      if (!acc[type]) {
        acc[type] = {
          tipo: type,
          estoque: 0,
          prontaEntrega: 0,
          pedidosAbertos: 0
        };
      }
      acc[type].estoque += product.Estoque;
      acc[type].prontaEntrega += product['Pronta Entrega'];
      acc[type].pedidosAbertos += product['Pedidos em Aberto'];
      return acc;
    }, {} as Record<string, {
      tipo: string;
      estoque: number;
      prontaEntrega: number;
      pedidosAbertos: number;
    }>);

    return Object.values(groupedData).slice(0, 10); // Top 10 tipos
  }, [products]);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Estoque por Tipo de Produto
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="tipo" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString('pt-BR')} />
          <Legend />
          <Bar dataKey="estoque" fill="#3B82F6" name="Estoque" />
          <Bar dataKey="prontaEntrega" fill="#10B981" name="Pronta Entrega" />
          <Bar dataKey="pedidosAbertos" fill="#F59E0B" name="Pedidos Abertos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StockByCollectionChart = ({ products }: ChartsProps) => {
  const data = useMemo(() => {
    const groupedData = products.reduce((acc, product) => {
      const collection = product['Coleção Atual'] || 'Sem Coleção';
      if (!acc[collection]) {
        acc[collection] = {
          colecao: collection,
          estoque: 0,
          vendas30d: 0
        };
      }
      acc[collection].estoque += product.Estoque;
      acc[collection].vendas30d += product['Venda 30d'];
      return acc;
    }, {} as Record<string, {
      colecao: string;
      estoque: number;
      vendas30d: number;
    }>);

    return Object.values(groupedData)
      .sort((a, b) => b.estoque - a.estoque)
      .slice(0, 8); // Top 8 coleções
  }, [products]);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Estoque vs Vendas por Coleção
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="colecao" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString('pt-BR')} />
          <Legend />
          <Bar dataKey="estoque" fill="#8B5CF6" name="Estoque Atual" />
          <Bar dataKey="vendas30d" fill="#EC4899" name="Vendas 30d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RuptureDistributionChart = ({ products }: ChartsProps) => {
  const data = useMemo(() => {
    const withStock = products.filter(p => p.Estoque > 0).length;
    const withoutStock = products.filter(p => p.Estoque === 0).length;
    const lowStock = products.filter(p => p.Estoque > 0 && p.Estoque <= 5).length;

    return [
      { name: 'Com Estoque', value: withStock - lowStock, color: '#10B981' },
      { name: 'Estoque Baixo (≤5)', value: lowStock, color: '#F59E0B' },
      { name: 'Sem Estoque', value: withoutStock, color: '#EF4444' }
    ];
  }, [products]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    
    if (!percent || percent < 0.05) return null; // Não mostrar labels muito pequenos
    
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
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribuição de Estoque
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString('pt-BR')} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};