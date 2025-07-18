'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Clock,
  DollarSign
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
import { AlertsPanel } from '@/components/AlertsPanel';
import { ABCAnalysis } from '@/components/ABCAnalysis';
import { KPIDashboard } from '@/components/KPIDashboard';
import { AdvancedFilters } from '@/components/AdvancedFilters';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'travesseiros' | 'linha-branca' | 'analytics' | 'alerts' | 'kpis'>('dashboard');
  const [filteredProducts, setFilteredProducts] = useState(extendedProducts);
  
  const {
    products,
    extendedProducts,
    loading,
    error,
    parseExcelFile,
    travesseiroProducts,
    linhaBrancaProducts,
    advancedAnalytics,
    stockAlerts,
    kpiTargets,
    analyticsService,
    filterOptions
  } = useExcelData();

  // Sincronizar produtos filtrados com produtos carregados
  useEffect(() => {
    setFilteredProducts(extendedProducts);
  }, [extendedProducts]);

  const handleFilterChange = (filtered: typeof extendedProducts) => {
    setFilteredProducts(filtered);
  };

  const hasData = products.length > 0;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <AdvancedFilters
        products={extendedProducts}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />

      {/* Métricas Principais (baseadas nos produtos filtrados) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total de SKUs"
          value={filteredProducts.length}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Itens em Ruptura"
          value={filteredProducts.filter(p => p['Estoque Atual'] === 0).length}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Itens Críticos"
          value={filteredProducts.filter(p => p['Estoque Atual'] < 10 && p['Estoque Atual'] > 0).length}
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Valor do Estoque"
          value={`R$ ${(filteredProducts.reduce((sum, p) => sum + (p['Estoque Atual'] * p['Preço de Venda']), 0) / 1000).toFixed(0)}K`}
          icon={BarChart3}
          color="green"
        />
        <MetricCard
          title="Giro Médio"
          value={`${(filteredProducts.reduce((sum, p) => sum + p.giroEstoque, 0) / filteredProducts.length).toFixed(1)}x`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Nível de Serviço"
          value={`${((filteredProducts.filter(p => p['Estoque Atual'] > 0).length / filteredProducts.length) * 100).toFixed(1)}%`}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Dias Médios Estoque"
          value={`${(filteredProducts.reduce((sum, p) => sum + p.diasCobertura, 0) / filteredProducts.length).toFixed(0)} dias`}
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Margem Média"
          value={`${(filteredProducts.reduce((sum, p) => sum + p.margemLucro, 0) / filteredProducts.length).toFixed(1)}%`}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Eficiência Estoque"
          value={`${(filteredProducts.reduce((sum, p) => sum + p.eficienciaEstoque, 0) / filteredProducts.length).toFixed(1)}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Gráficos (baseados nos produtos filtrados) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockByTypeChart products={filteredProducts} />
        <RuptureDistributionChart products={filteredProducts} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <StockByCollectionChart products={filteredProducts} />
      </div>
    </div>
  );

  const renderTravesseiros = () => {
    // Filtrar travesseiros com base nos filtros aplicados
    const filteredTravesseiros = filteredProducts.filter(p => 
      travesseiroProducts.some(tp => tp['ID VTEX'] === p['ID VTEX'])
    );

    return (
      <div className="space-y-6">
        <AdvancedFilters
          products={travesseiroProducts}
          filterOptions={filterOptions}
          onFilterChange={(filtered) => {
            // Aplicar filtros específicos para travesseiros
            setFilteredProducts(prev => {
              const otherProducts = prev.filter(p => 
                !travesseiroProducts.some(tp => tp['ID VTEX'] === p['ID VTEX'])
              );
              return [...otherProducts, ...filtered];
            });
          }}
        />
        
        <ProductTable 
          products={filteredTravesseiros}
          title={`Produtos - Travesseiros (${filteredTravesseiros.length})`}
        />
      </div>
    );
  };

  const renderLinhaBranca = () => {
    // Filtrar linha branca com base nos filtros aplicados
    const filteredLinhaBranca = filteredProducts.filter(p => 
      linhaBrancaProducts.some(lb => lb['ID VTEX'] === p['ID VTEX'])
    );

    return (
      <div className="space-y-6">
        <AdvancedFilters
          products={linhaBrancaProducts}
          filterOptions={filterOptions}
          onFilterChange={(filtered) => {
            // Aplicar filtros específicos para linha branca
            setFilteredProducts(prev => {
              const otherProducts = prev.filter(p => 
                !linhaBrancaProducts.some(lb => lb['ID VTEX'] === p['ID VTEX'])
              );
              return [...otherProducts, ...filtered];
            });
          }}
        />
        
        <ProductTable 
          products={filteredLinhaBranca}
          title={`Produtos - Linha Branca (${filteredLinhaBranca.length})`}
          isLinhaBranca={true}
        />
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="space-y-6">
      <AdvancedFilters
        products={extendedProducts}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />
      
      {advancedAnalytics && (
        <ABCAnalysis 
          abcResults={advancedAnalytics.abcAnalysis.filter(abc => 
            filteredProducts.some(p => p['ID VTEX'] === abc.productId)
          )} 
        />
      )}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <AlertsPanel alerts={stockAlerts} />
    </div>
  );

  const renderKPIs = () => (
    <div className="space-y-6">
      {analyticsService && (
        <KPIDashboard 
          kpiTargets={kpiTargets}
          performanceMetrics={analyticsService['calculatePerformanceMetrics']()}
        />
      )}
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
          alertsCount={stockAlerts.length}
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
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'kpis' && renderKPIs()}
            {activeTab === 'alerts' && renderAlerts()}
            {activeTab === 'travesseiros' && renderTravesseiros()}
            {activeTab === 'linha-branca' && renderLinhaBranca()}
          </>
        )}
      </main>
    </div>
  );
}
