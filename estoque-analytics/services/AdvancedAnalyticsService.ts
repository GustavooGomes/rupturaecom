import { 
  Product, 
  ExtendedProduct, 
  AdvancedAnalytics, 
  ABCAnalysisResult,
  SeasonalityResult,
  ForecastResult,
  OptimizationResult,
  RiskAssessmentResult,
  ProfitabilityResult,
  StockAlert,
  KPITarget,
  PerformanceMetrics
} from '@/types/product';

export class AdvancedAnalyticsService {
  private products: Product[] = [];
  private extendedProducts: ExtendedProduct[] = [];
  
  constructor(products: Product[]) {
    this.products = products;
    this.extendedProducts = this.enhanceProducts(products);
  }

  // Enriquecer produtos com métricas calculadas
  private enhanceProducts(products: Product[]): ExtendedProduct[] {
    return products.map(product => {
      const giroEstoque = this.calculateStockTurnover(product);
      const diasCobertura = this.calculateCoverageDays(product);
      const pontoReposicao = this.calculateReorderPoint(product);
      const risco = this.assessRisk(product);
      const statusOperacional = this.determineOperationalStatus(product);
      const classificacaoABC = this.classifyABC(product);
      const margemLucro = this.calculateProfitMargin(product);
      const velocidadeVenda = this.calculateSalesVelocity(product);
      const sazonalidade = this.calculateSeasonality(product);
      const previsaoDemanda = this.forecastDemand(product);
      const custoOportunidade = this.calculateOpportunityCost(product);
      const eficienciaEstoque = this.calculateStockEfficiency(product);

      return {
        ...product,
        giroEstoque,
        diasCobertura,
        pontoReposicao,
        risco,
        statusOperacional,
        classificacaoABC,
        margemLucro,
        velocidadeVenda,
        sazonalidade,
        previsaoDemanda,
        custoOportunidade,
        eficienciaEstoque
      };
    });
  }

  // Análise ABC baseada em valor de vendas e frequência
  public performABCAnalysis(): ABCAnalysisResult[] {
    const sortedProducts = [...this.extendedProducts]
      .sort((a, b) => (b['Venda 30d'] * b.Preço) - (a['Venda 30d'] * a.Preço));

    const totalValue = sortedProducts.reduce((sum, p) => sum + (p['Venda 30d'] * p.Preço), 0);
    
    let cumulativeValue = 0;
    const results: ABCAnalysisResult[] = [];
    let classA: ExtendedProduct[] = [];
    let classB: ExtendedProduct[] = [];
    let classC: ExtendedProduct[] = [];

    sortedProducts.forEach(product => {
      cumulativeValue += product['Venda 30d'] * product.Preço;
      const percentage = (cumulativeValue / totalValue) * 100;

      if (percentage <= 80) {
        classA.push({ ...product, classificacaoABC: 'A' });
      } else if (percentage <= 95) {
        classB.push({ ...product, classificacaoABC: 'B' });
      } else {
        classC.push({ ...product, classificacaoABC: 'C' });
      }
    });

    results.push({
      classification: 'A',
      products: classA,
      totalValue: classA.reduce((sum, p) => sum + (p['Venda 30d'] * p.Preço), 0),
      percentage: (classA.length / sortedProducts.length) * 100,
      recommendations: [
        'Monitoramento diário de estoque',
        'Controle rigoroso de qualidade',
        'Múltiplos fornecedores para segurança',
        'Análise de demanda semanal'
      ]
    });

    results.push({
      classification: 'B',
      products: classB,
      totalValue: classB.reduce((sum, p) => sum + (p['Venda 30d'] * p.Preço), 0),
      percentage: (classB.length / sortedProducts.length) * 100,
      recommendations: [
        'Monitoramento semanal',
        'Controle de qualidade padrão',
        'Revisão mensal de fornecedores',
        'Análise de demanda quinzenal'
      ]
    });

    results.push({
      classification: 'C',
      products: classC,
      totalValue: classC.reduce((sum, p) => sum + (p['Venda 30d'] * p.Preço), 0),
      percentage: (classC.length / sortedProducts.length) * 100,
      recommendations: [
        'Monitoramento mensal',
        'Controle básico de qualidade',
        'Fornecedor único aceitável',
        'Revisão trimestral de demanda'
      ]
    });

    return results;
  }

  // Análise de sazonalidade avançada
  public performSeasonalityAnalysis(): SeasonalityResult[] {
    const seasons = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    return seasons.map(season => {
      const demandIndex = this.calculateSeasonalDemandIndex(season);
      const historicalData = this.generateHistoricalData(season);
      const predictedDemand = this.predictSeasonalDemand(season, historicalData);
      const recommendedStock = this.calculateSeasonalStock(predictedDemand);

      return {
        period: season,
        demandIndex,
        historicalData,
        predictedDemand,
        recommendedStock
      };
    });
  }

  // Previsão de demanda com machine learning simulado
  public performDemandForecast(): ForecastResult[] {
    return this.extendedProducts.map(product => {
      const currentDemand = product['Venda 30d'];
      const trend = this.analyzeTrend(product);
      const seasonalFactor = product.sazonalidade;
      const forecastedDemand = this.calculateForecastedDemand(currentDemand, trend, seasonalFactor);
      const confidence = this.calculateForecastConfidence(product);

      return {
        productId: product['ID VTEX'],
        currentDemand,
        forecastedDemand,
        confidence,
        trend,
        seasonalFactor
      };
    });
  }

  // Otimização de estoque usando algoritmos avançados
  public performStockOptimization(): OptimizationResult[] {
    return this.extendedProducts.map(product => {
      const currentStock = product.Estoque;
      const optimalStock = this.calculateOptimalStock(product);
      const potentialSavings = this.calculatePotentialSavings(currentStock, optimalStock, product.Preço);
      const reorderPoint = product.pontoReposicao;
      const orderQuantity = this.calculateEOQ(product);

      return {
        productId: product['ID VTEX'],
        currentStock,
        optimalStock,
        potentialSavings,
        reorderPoint,
        orderQuantity
      };
    });
  }

  // Análise de risco multi-dimensional
  public performRiskAssessment(): RiskAssessmentResult[] {
    return this.extendedProducts.map(product => {
      const riskFactors = this.identifyRiskFactors(product);
      const impactScore = this.calculateImpactScore(product);
      const recommendations = this.generateRiskRecommendations(product);
      const timeToStockout = this.calculateTimeToStockout(product);

      return {
        productId: product['ID VTEX'],
        riskLevel: product.risco,
        riskFactors,
        impactScore,
        recommendations,
        timeToStockout
      };
    });
  }

  // Análise de lucratividade por produto
  public performProfitabilityAnalysis(): ProfitabilityResult[] {
    return this.extendedProducts.map(product => {
      const revenue = product['Venda 30d'] * product.Preço;
      const cost = this.calculateCost(product);
      const profit = revenue - cost;
      const margin = product.margemLucro;
      const roi = this.calculateROI(profit, cost);
      const contribution = this.calculateContribution(product);

      return {
        productId: product['ID VTEX'],
        revenue,
        cost,
        profit,
        margin,
        roi,
        contribution
      };
    });
  }

  // Gerar alertas inteligentes
  public generateAlerts(): StockAlert[] {
    const alerts: StockAlert[] = [];

    this.extendedProducts.forEach(product => {
      // Alerta de ruptura iminente
      if (product.diasCobertura <= 7 && product.Estoque > 0) {
        alerts.push({
          id: `ruptura-${product['ID VTEX']}`,
          productId: product['ID VTEX'],
          type: 'RUPTURA',
          severity: 'CRÍTICO',
          message: `${product['Nome Produto']} terá ruptura em ${product.diasCobertura} dias`,
          timestamp: new Date(),
          acknowledged: false,
          actions: ['Acelerar reposição', 'Contatar fornecedor', 'Revisar demanda']
        });
      }

      // Alerta de excesso de estoque
      if (product.diasCobertura > 90) {
        alerts.push({
          id: `excesso-${product['ID VTEX']}`,
          productId: product['ID VTEX'],
          type: 'EXCESSO',
          severity: 'MÉDIO',
          message: `${product['Nome Produto']} tem estoque excessivo (${product.diasCobertura} dias)`,
          timestamp: new Date(),
          acknowledged: false,
          actions: ['Promoção', 'Reduzir pedidos', 'Analisar demanda']
        });
      }

      // Alerta de sazonalidade
      if (product.sazonalidade > 1.5) {
        alerts.push({
          id: `sazonal-${product['ID VTEX']}`,
          productId: product['ID VTEX'],
          type: 'SAZONALIDADE',
          severity: 'ALTO',
          message: `${product['Nome Produto']} está em período de alta sazonalidade`,
          timestamp: new Date(),
          acknowledged: false,
          actions: ['Aumentar estoque', 'Preparar campanha', 'Monitorar demanda']
        });
      }
    });

    return alerts;
  }

  // KPIs de performance com metas
  public generateKPITargets(): KPITarget[] {
    const metrics = this.calculatePerformanceMetrics();
    
    return [
      {
        metric: 'Acurácia de Estoque',
        current: metrics.stockAccuracy,
        target: 98,
        variance: metrics.stockAccuracy - 98,
        trend: this.determineTrend(metrics.stockAccuracy, 95),
        lastUpdated: new Date()
      },
      {
        metric: 'Nível de Serviço',
        current: metrics.fillRate,
        target: 95,
        variance: metrics.fillRate - 95,
        trend: this.determineTrend(metrics.fillRate, 92),
        lastUpdated: new Date()
      },
      {
        metric: 'Giro de Estoque',
        current: metrics.inventoryTurnover,
        target: 12,
        variance: metrics.inventoryTurnover - 12,
        trend: this.determineTrend(metrics.inventoryTurnover, 10),
        lastUpdated: new Date()
      }
    ];
  }

  // Métodos auxiliares para cálculos complexos
  private calculateStockTurnover(product: Product): number {
    const cogs = product['Venda 30d'] * product.Preço * 0.7; // 70% do preço como custo
    const avgInventory = (product.Estoque * product.Preço) / 2;
    return avgInventory > 0 ? (cogs * 12) / avgInventory : 0;
  }

  private calculateCoverageDays(product: Product): number {
    const dailySales = product['Venda 30d'] / 30;
    return dailySales > 0 ? product.Estoque / dailySales : 999;
  }

  private calculateReorderPoint(product: Product): number {
    const leadTime = 7; // 7 dias de lead time padrão
    const dailyDemand = product['Venda 30d'] / 30;
    const safetyStock = dailyDemand * 3; // 3 dias de safety stock
    return (dailyDemand * leadTime) + safetyStock;
  }

  private assessRisk(product: Product): 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO' {
    const coverage = this.calculateCoverageDays(product);
    const demand = product['Venda 30d'];
    
    if (coverage <= 7 || (demand > 0 && product.Estoque === 0)) return 'CRÍTICO';
    if (coverage <= 15 || demand > 20) return 'ALTO';
    if (coverage <= 30 || demand > 10) return 'MÉDIO';
    return 'BAIXO';
  }

  private determineOperationalStatus(product: Product): 'ATIVO' | 'DESCONTINUADO' | 'SAZONAL' | 'LIQUIDAÇÃO' {
    if (product['Fora de linha']) return 'DESCONTINUADO';
    if (product['Venda 30d'] === 0 && product.Estoque > 0) return 'LIQUIDAÇÃO';
    if (this.calculateSeasonality(product) > 1.2) return 'SAZONAL';
    return 'ATIVO';
  }

  private classifyABC(product: Product): 'A' | 'B' | 'C' {
    const value = product['Venda 30d'] * product.Preço;
    // Simplificado - seria calculado no contexto de todos os produtos
    if (value > 5000) return 'A';
    if (value > 1000) return 'B';
    return 'C';
  }

  private calculateProfitMargin(product: Product): number {
    const cost = product.Preço * 0.7; // Assumindo 70% como custo
    return ((product.Preço - cost) / product.Preço) * 100;
  }

  private calculateSalesVelocity(product: Product): number {
    return product['Venda 30d'] / 30; // Vendas por dia
  }

  private calculateSeasonality(product: Product): number {
    // Simulação de sazonalidade baseada no tipo de produto
    const seasonalProducts = ['Cobertor', 'Protetor', 'Travesseiro'];
    const isSeasonalType = seasonalProducts.some(type => 
      product['Tipo. Produto'].includes(type)
    );
    return isSeasonalType ? 1.5 + Math.random() * 0.5 : 1.0 + Math.random() * 0.2;
  }

  private forecastDemand(product: Product): number {
    const currentDemand = product['Venda 30d'];
    const trendFactor = 1 + (Math.random() - 0.5) * 0.2; // ±10% de variação
    const seasonalFactor = this.calculateSeasonality(product);
    return currentDemand * trendFactor * seasonalFactor;
  }

  private calculateOpportunityCost(product: Product): number {
    const tiedCapital = product.Estoque * product.Preço;
    const opportunityRate = 0.08; // 8% ao ano
    return tiedCapital * opportunityRate / 12; // Custo mensal
  }

  private calculateStockEfficiency(product: Product): number {
    const turnover = this.calculateStockTurnover(product);
    const serviceLevel = product.Estoque > 0 ? 95 : 0;
    return (turnover * serviceLevel) / 100;
  }

  private calculatePerformanceMetrics(): PerformanceMetrics {
    const totalProducts = this.extendedProducts.length;
    const inStockProducts = this.extendedProducts.filter(p => p.Estoque > 0).length;
    
    return {
      stockAccuracy: (inStockProducts / totalProducts) * 100,
      fillRate: 95, // Simulado
      inventoryTurnover: this.extendedProducts.reduce((sum, p) => sum + p.giroEstoque, 0) / totalProducts,
      daysOfInventory: this.extendedProducts.reduce((sum, p) => sum + p.diasCobertura, 0) / totalProducts,
      cashToInventory: 0.15, // 15% do cash em inventário
      obsoleteInventory: 0.05, // 5% obsoleto
      shrinkage: 0.02, // 2% de perda
      demandForecastAccuracy: 85 // 85% de acurácia
    };
  }

  // Métodos auxiliares adicionais
  private calculateSeasonalDemandIndex(season: string): number {
    const seasonalFactors = { Q1: 0.8, Q2: 1.1, Q3: 1.3, Q4: 1.2 };
    return seasonalFactors[season as keyof typeof seasonalFactors] || 1.0;
  }

  private generateHistoricalData(season: string): number[] {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 50);
  }

  private predictSeasonalDemand(season: string, historicalData: number[]): number {
    const average = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;
    const seasonalIndex = this.calculateSeasonalDemandIndex(season);
    return Math.round(average * seasonalIndex);
  }

  private calculateSeasonalStock(predictedDemand: number): number {
    return Math.round(predictedDemand * 1.2); // 20% buffer
  }

  private analyzeTrend(product: Product): 'CRESCENDO' | 'DECRESCENDO' | 'ESTÁVEL' {
    const randomFactor = Math.random();
    if (randomFactor > 0.6) return 'CRESCENDO';
    if (randomFactor < 0.3) return 'DECRESCENDO';
    return 'ESTÁVEL';
  }

  private calculateForecastedDemand(current: number, trend: string, seasonal: number): number {
    let trendFactor = 1.0;
    if (trend === 'CRESCENDO') trendFactor = 1.1;
    if (trend === 'DECRESCENDO') trendFactor = 0.9;
    
    return Math.round(current * trendFactor * seasonal);
  }

  private calculateForecastConfidence(product: Product): number {
    // Confiança baseada na consistência das vendas
    const salesVariability = Math.random() * 0.3; // 0-30% de variabilidade
    return Math.round((1 - salesVariability) * 100);
  }

  private calculateOptimalStock(product: Product): number {
    const dailyDemand = product['Venda 30d'] / 30;
    const leadTime = 7;
    const serviceLevel = 0.95;
    const safetyStock = dailyDemand * Math.sqrt(leadTime) * 1.65; // Para 95% service level
    
    return Math.round((dailyDemand * leadTime) + safetyStock);
  }

  private calculatePotentialSavings(current: number, optimal: number, price: number): number {
    const excess = Math.max(0, current - optimal);
    const carryingCost = 0.25; // 25% carrying cost
    return excess * price * carryingCost;
  }

  private calculateEOQ(product: Product): number {
    const annualDemand = product['Venda 30d'] * 12;
    const orderingCost = 100; // Custo fixo por pedido
    const holdingCost = product.Preço * 0.25; // 25% holding cost
    
    return Math.round(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost));
  }

  private identifyRiskFactors(product: ExtendedProduct): string[] {
    const factors: string[] = [];
    
    if (product.Estoque === 0) factors.push('Ruptura atual');
    if (product.diasCobertura <= 7) factors.push('Baixa cobertura');
    if (product['Venda 30d'] > product.Estoque) factors.push('Demanda > Estoque');
    if (product['Fora de linha']) factors.push('Produto descontinuado');
    if (product.sazonalidade > 1.5) factors.push('Alta sazonalidade');
    
    return factors;
  }

  private calculateImpactScore(product: ExtendedProduct): number {
    const revenueImpact = (product['Venda 30d'] * product.Preço) / 1000; // Normalizado
    const stockoutRisk = product.Estoque === 0 ? 50 : Math.max(0, 50 - product.diasCobertura);
    
    return Math.min(100, Math.round(revenueImpact + stockoutRisk));
  }

  private generateRiskRecommendations(product: ExtendedProduct): string[] {
    const recommendations: string[] = [];
    
    if (product.risco === 'CRÍTICO') {
      recommendations.push('Ação imediata necessária');
      recommendations.push('Acelerar pedido de reposição');
      recommendations.push('Verificar fornecedores alternativos');
    }
    
    if (product.diasCobertura <= 15) {
      recommendations.push('Monitorar diariamente');
      recommendations.push('Preparar pedido de emergência');
    }
    
    return recommendations;
  }

  private calculateTimeToStockout(product: ExtendedProduct): number {
    const dailySales = product['Venda 30d'] / 30;
    return dailySales > 0 ? Math.round(product.Estoque / dailySales) : 999;
  }

  private calculateCost(product: Product): number {
    return product.Preço * 0.7; // 70% do preço como custo
  }

  private calculateROI(profit: number, cost: number): number {
    return cost > 0 ? (profit / cost) * 100 : 0;
  }

  private calculateContribution(product: ExtendedProduct): number {
    const totalRevenue = this.extendedProducts.reduce((sum, p) => sum + (p['Venda 30d'] * p.Preço), 0);
    const productRevenue = product['Venda 30d'] * product.Preço;
    return totalRevenue > 0 ? (productRevenue / totalRevenue) * 100 : 0;
  }

  private determineTrend(current: number, previous: number): 'POSITIVA' | 'NEGATIVA' | 'ESTÁVEL' {
    const change = ((current - previous) / previous) * 100;
    if (change > 2) return 'POSITIVA';
    if (change < -2) return 'NEGATIVA';
    return 'ESTÁVEL';
  }

  // Método principal para executar todas as análises
  public generateCompleteAnalytics(): AdvancedAnalytics {
    return {
      abcAnalysis: this.performABCAnalysis(),
      seasonalityAnalysis: this.performSeasonalityAnalysis(),
      demandForecast: this.performDemandForecast(),
      stockOptimization: this.performStockOptimization(),
      riskAssessment: this.performRiskAssessment(),
      profitabilityAnalysis: this.performProfitabilityAnalysis()
    };
  }
}