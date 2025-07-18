'use client';

import { useExcelData } from '@/hooks/useExcelData';
import { FileUpload } from '@/components/FileUpload';
import { MetricCard } from '@/components/MetricCard';
import { ProductTable } from '@/components/ProductTable';
import { StockByTypeChart, StockByCollectionChart, RuptureDistributionChart } from '@/components/Charts';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { useState, useEffect } from 'react';
import { ExtendedProduct, Product } from '@/types/product';
import { Package, DollarSign, AlertTriangle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { 
    products, 
    extendedProducts, 
    loading, 
    error, 
    parseExcelFile, 
    filterOptions
  } = useExcelData();

  const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);

  useEffect(() => {
    setFilteredProducts(extendedProducts);
  }, [extendedProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard de Estoque</h1>
        <FileUpload onFileUpload={parseExcelFile} loading={loading} error={error} />
      </div>
    );
  }

  const handleFilterChange = (filtered: ExtendedProduct[]) => {
    setFilteredProducts(filtered);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Estoque</h1>
        <FileUpload onFileUpload={parseExcelFile} loading={loading} error={error} />
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters
        products={extendedProducts}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        className="mb-6"
      />

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de SKUs"
          value={filteredProducts.length.toString()}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Valor do Estoque"
          value={`R$ ${filteredProducts.length > 0 ? filteredProducts.reduce((sum, p) => sum + ((p as any)['Estoque Atual'] * (p as any)['Preço de Venda']), 0).toLocaleString('pt-BR') : '0'}`}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="SKUs em Ruptura"
          value={filteredProducts.filter(p => (p as any)['Estoque Atual'] === 0).length.toString()}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Produtos Críticos"
          value={filteredProducts.filter(p => (p as any)['Estoque Atual'] < 10 && (p as any)['Estoque Atual'] > 0).length.toString()}
          icon={AlertCircle}
          color="yellow"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockByTypeChart products={filteredProducts} />
        <RuptureDistributionChart products={filteredProducts} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <StockByCollectionChart products={filteredProducts} />
      </div>

      {/* Tabela de produtos */}
      <ProductTable products={filteredProducts.slice(0, 50)} />
    </div>
  );
}