'use client';

import { useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { 
  Product, 
  ExtendedProduct,
  DashboardMetrics, 
  FilterOptions, 
  AdvancedAnalytics,
  StockAlert,
  KPITarget,
  PerformanceMetrics
} from '@/types/product';
import { AdvancedAnalyticsService } from '@/services/AdvancedAnalyticsService';

export const useExcelData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseExcelFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      
      if (workbook.SheetNames.length === 0) {
        throw new Error('Arquivo Excel não contém planilhas válidas');
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        throw new Error('Arquivo Excel deve conter pelo menos uma linha de cabeçalho e uma linha de dados');
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];

      // Verificar se todas as colunas necessárias estão presentes
      const requiredColumns = [
        'ID VTEX', 'Produto', 'Derivação', 'Produto-Derivação', 'Nome Produto',
        'Tipo. Produto', 'Tamanho', 'Descrição', 'Compl.', 'Estoque',
        'Pronta Entrega', 'Regulador', 'Pedidos em Aberto', 'Preço',
        'Venda 30d', 'Multiplo', 'Linha Comercial', 'Descrição Linha Comercial',
        'Coleção Atual', 'Início Coleção', 'Fim Coleção', 'Fora de linha',
        'Agrupamento de Custos', 'Usu.Alteração', 'Nome Usuário Alteração'
      ];

      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        throw new Error(`Colunas ausentes no arquivo Excel: ${missingColumns.join(', ')}`);
      }

      const parsedProducts: Product[] = rows.map((row, index) => {
        try {
          const product: any = {};
          headers.forEach((header, headerIndex) => {
            const value = row[headerIndex];
            
            // Converter números para os campos apropriados
            if (['Estoque', 'Pronta Entrega', 'Pedidos em Aberto', 'Preço', 'Venda 30d', 'Multiplo'].includes(header)) {
              product[header] = typeof value === 'number' ? value : parseFloat(value) || 0;
            }
            // Converter boolean para 'Fora de linha'
            else if (header === 'Fora de linha') {
              product[header] = Boolean(value);
            }
            // Demais campos como string
            else {
              product[header] = String(value || '');
            }
          });
          
          return product as Product;
        } catch (err) {
          console.warn(`Erro ao processar linha ${index + 2}:`, err);
          return null;
        }
      }).filter(Boolean) as Product[];

      setProducts(parsedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao processar arquivo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Serviço de análise avançada
  const analyticsService = useMemo(() => {
    return products.length > 0 ? new AdvancedAnalyticsService(products) : null;
  }, [products]);

  // Produtos enriquecidos com métricas avançadas
  const extendedProducts = useMemo((): ExtendedProduct[] => {
    return analyticsService ? analyticsService['extendedProducts'] : [];
  }, [analyticsService]);

  // Métricas do dashboard expandidas
  const dashboardMetrics = useMemo((): DashboardMetrics => {
    if (products.length === 0) {
      return {
        totalSKUs: 0,
        itemsWithZeroStock: 0,
        totalOpenOrders: 0,
        totalStockUnits: 0,
        totalSales30d: 0,
        averageStockDays: 0,
        stockTurnover: 0,
        serviceLevel: 0,
        totalStockValue: 0,
        criticalItems: 0,
        seasonalItems: 0,
        profitMargin: 0,
        stockEfficiency: 0,
        demandVariability: 0,
        forecastAccuracy: 0
      };
    }

    const totalStockValue = products.reduce((sum, p) => sum + (p.Estoque * p.Preço), 0);
    const criticalItems = extendedProducts.filter(p => p.risco === 'CRÍTICO').length;
    const seasonalItems = extendedProducts.filter(p => p.statusOperacional === 'SAZONAL').length;
    const avgStockDays = extendedProducts.length > 0 
      ? extendedProducts.reduce((sum, p) => sum + p.diasCobertura, 0) / extendedProducts.length 
      : 0;
    const avgStockTurnover = extendedProducts.length > 0 
      ? extendedProducts.reduce((sum, p) => sum + p.giroEstoque, 0) / extendedProducts.length 
      : 0;
    const avgProfitMargin = extendedProducts.length > 0 
      ? extendedProducts.reduce((sum, p) => sum + p.margemLucro, 0) / extendedProducts.length 
      : 0;
    const avgStockEfficiency = extendedProducts.length > 0 
      ? extendedProducts.reduce((sum, p) => sum + p.eficienciaEstoque, 0) / extendedProducts.length 
      : 0;

    return {
      totalSKUs: products.length,
      itemsWithZeroStock: products.filter(p => p.Estoque === 0).length,
      totalOpenOrders: products.reduce((sum, p) => sum + p['Pedidos em Aberto'], 0),
      totalStockUnits: products.reduce((sum, p) => sum + p.Estoque, 0),
      totalSales30d: products.reduce((sum, p) => sum + p['Venda 30d'], 0),
      averageStockDays: avgStockDays,
      stockTurnover: avgStockTurnover,
      serviceLevel: products.filter(p => p.Estoque > 0).length / products.length * 100,
      totalStockValue: totalStockValue,
      criticalItems: criticalItems,
      seasonalItems: seasonalItems,
      profitMargin: avgProfitMargin,
      stockEfficiency: avgStockEfficiency,
      demandVariability: 15 + Math.random() * 10, // Simulado: 15-25%
      forecastAccuracy: 85 + Math.random() * 10 // Simulado: 85-95%
    };
  }, [products, extendedProducts]);

  // Filtros disponíveis expandidos
  const filterOptions = useMemo((): FilterOptions => {
    if (products.length === 0 || extendedProducts.length === 0) {
      return {
        tiposProduto: [],
        tamanhos: [],
        colecoes: [],
        linhasComerciais: [],
        riscos: [],
        classificacoesABC: [],
        statusOperacional: []
      };
    }

    return {
      tiposProduto: [...new Set(products.map(p => p['Tipo. Produto']).filter(Boolean))],
      tamanhos: [...new Set(products.map(p => p.Tamanho).filter(Boolean))],
      colecoes: [...new Set(products.map(p => p['Coleção Atual']).filter(Boolean))],
      linhasComerciais: [...new Set(products.map(p => p['Descrição Linha Comercial']).filter(Boolean))],
      riscos: [...new Set(extendedProducts.map(p => p.risco).filter(Boolean))],
      classificacoesABC: [...new Set(extendedProducts.map(p => p.classificacaoABC).filter(Boolean))],
      statusOperacional: [...new Set(extendedProducts.map(p => p.statusOperacional).filter(Boolean))]
    };
  }, [products, extendedProducts]);

  // Produtos filtrados por travesseiros (com métricas avançadas)
  const travesseiroProducts = useMemo(() => {
    return extendedProducts.filter(p => 
      p['Tipo. Produto'] === 'Travesseiro' || 
      p['Tipo. Produto'] === 'Protetor de Travesseiro'
    );
  }, [extendedProducts]);

  // Produtos da linha branca (com métricas avançadas)
  const linhaBrancaProducts = useMemo(() => {
    return extendedProducts.filter(p => 
      p['Descrição Linha Comercial'] === 'Linha Branca'
    );
  }, [extendedProducts]);

  // Análises avançadas
  const advancedAnalytics = useMemo((): AdvancedAnalytics | null => {
    return analyticsService ? analyticsService.generateCompleteAnalytics() : null;
  }, [analyticsService]);

  // Alertas de estoque
  const stockAlerts = useMemo((): StockAlert[] => {
    return analyticsService ? analyticsService.generateAlerts() : [];
  }, [analyticsService]);

  // KPIs com metas
  const kpiTargets = useMemo((): KPITarget[] => {
    return analyticsService ? analyticsService.generateKPITargets() : [];
  }, [analyticsService]);

  return {
    products,
    extendedProducts,
    loading,
    error,
    parseExcelFile,
    dashboardMetrics,
    filterOptions,
    travesseiroProducts,
    linhaBrancaProducts,
    advancedAnalytics,
    stockAlerts,
    kpiTargets,
    analyticsService
  };
};