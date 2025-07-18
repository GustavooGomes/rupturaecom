'use client';

import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  BarChart3, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';

import { useExcelData } from '@/hooks/useExcelData';
import { FileUpload } from '@/components/FileUpload';
import { Navigation } from '@/components/Navigation';
import { MetricCard } from '@/components/MetricCard';
import { ProductTable } from '@/components/ProductTable';
import { 
  StockByTypeChart, 
  StockByCollectionChart, 
  RuptureDistributionChart 
} from '@/components/Charts';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'travesseiros' | 'linha-branca'>('dashboard');
  
  const {
    products,
    loading,
    error,
    parseExcelFile,
    dashboardMetrics,
    travesseiroProducts,
    linhaBrancaProducts
  } = useExcelData();

  const hasData = products.length > 0;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total de SKUs"
          value={dashboardMetrics.totalSKUs}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Itens em Ruptura"
          value={dashboardMetrics.itemsWithZeroStock}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Pedidos Abertos"
          value={dashboardMetrics.totalOpenOrders}
          icon={ShoppingCart}
          color="yellow"
        />
        <MetricCard
          title="Unidades em Estoque"
          value={dashboardMetrics.totalStockUnits}
          icon={BarChart3}
          color="green"
        />
        <MetricCard
          title="Vendas 30d"
          value={dashboardMetrics.totalSales30d}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockByTypeChart products={products} />
        <RuptureDistributionChart products={products} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <StockByCollectionChart products={products} />
      </div>
    </div>
  );

  const renderTravesseiros = () => (
    <div className="space-y-6">
      <ProductTable 
        products={travesseiroProducts}
        title="Produtos - Travesseiros"
      />
    </div>
  );

  const renderLinhaBranca = () => (
    <div className="space-y-6">
      <ProductTable 
        products={linhaBrancaProducts}
        title="Produtos - Linha Branca"
        isLinhaBranca={true}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Estoque Analytics
              </h1>
            </div>
            
            {hasData && (
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.xlsx,.xls';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) parseExcelFile(file);
                  };
                  input.click();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Carregar Novo Arquivo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      {hasData && (
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          travesseiroCount={travesseiroProducts.length}
          linhaBrancaCount={linhaBrancaProducts.length}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasData ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sistema de Controle de Estoque
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Carregue sua planilha Excel para começar a análise
              </p>
            </div>
            <FileUpload
              onFileUpload={parseExcelFile}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'travesseiros' && renderTravesseiros()}
            {activeTab === 'linha-branca' && renderLinhaBranca()}
          </>
        )}
      </main>
    </div>
  );
}
