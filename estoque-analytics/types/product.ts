export interface Product {
  'ID VTEX': string;
  'Produto': string;
  'Derivação': string;
  'Produto-Derivação': string;
  'Nome Produto': string;
  'Tipo. Produto': string;
  'Tamanho': string;
  'Descrição': string;
  'Compl.': string;
  'Estoque': number;
  'Pronta Entrega': number;
  'Regulador': string;
  'Pedidos em Aberto': number;
  'Preço': number;
  'Venda 30d': number;
  'Multiplo': number;
  'Linha Comercial': string;
  'Descrição Linha Comercial': string;
  'Coleção Atual': string;
  'Início Coleção': string;
  'Fim Coleção': string;
  'Fora de linha': boolean;
  'Agrupamento de Custos': string;
  'Usu.Alteração': string;
  'Nome Usuário Alteração': string;
}

export interface ExtendedProduct extends Product {
  // Métricas calculadas
  giroEstoque: number;
  diasCobertura: number;
  pontoReposicao: number;
  risco: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO';
  statusOperacional: 'ATIVO' | 'DESCONTINUADO' | 'SAZONAL' | 'LIQUIDAÇÃO';
  classificacaoABC: 'A' | 'B' | 'C';
  margemLucro: number;
  velocidadeVenda: number;
  sazonalidade: number;
  previsaoDemanda: number;
  custoOportunidade: number;
  eficienciaEstoque: number;
}

export interface DashboardMetrics {
  totalSKUs: number;
  itemsWithZeroStock: number;
  totalOpenOrders: number;
  totalStockUnits: number;
  totalSales30d: number;
  // Métricas avançadas
  averageStockDays: number;
  stockTurnover: number;
  serviceLevel: number;
  totalStockValue: number;
  criticalItems: number;
  seasonalItems: number;
  profitMargin: number;
  stockEfficiency: number;
  demandVariability: number;
  forecastAccuracy: number;
}

export interface FilterOptions {
  tiposProduto: string[];
  tamanhos: string[];
  colecoes: string[];
  linhasComerciais: string[];
  riscos: string[];
  classificacoesABC: string[];
  statusOperacional: string[];
}

export interface AdvancedAnalytics {
  abcAnalysis: ABCAnalysisResult[];
  seasonalityAnalysis: SeasonalityResult[];
  demandForecast: ForecastResult[];
  stockOptimization: OptimizationResult[];
  riskAssessment: RiskAssessmentResult[];
  profitabilityAnalysis: ProfitabilityResult[];
}

export interface ABCAnalysisResult {
  classification: 'A' | 'B' | 'C';
  products: ExtendedProduct[];
  totalValue: number;
  percentage: number;
  recommendations: string[];
}

export interface SeasonalityResult {
  period: string;
  demandIndex: number;
  historicalData: number[];
  predictedDemand: number;
  recommendedStock: number;
}

export interface ForecastResult {
  productId: string;
  currentDemand: number;
  forecastedDemand: number;
  confidence: number;
  trend: 'CRESCENDO' | 'DECRESCENDO' | 'ESTÁVEL';
  seasonalFactor: number;
}

export interface OptimizationResult {
  productId: string;
  currentStock: number;
  optimalStock: number;
  potentialSavings: number;
  reorderPoint: number;
  orderQuantity: number;
}

export interface RiskAssessmentResult {
  productId: string;
  riskLevel: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO';
  riskFactors: string[];
  impactScore: number;
  recommendations: string[];
  timeToStockout: number;
}

export interface ProfitabilityResult {
  productId: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  roi: number;
  contribution: number;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO';
  active: boolean;
}

export interface StockAlert {
  id: string;
  productId: string;
  type: 'RUPTURA' | 'EXCESSO' | 'REPOSIÇÃO' | 'SAZONALIDADE' | 'QUALIDADE';
  severity: 'CRÍTICO' | 'ALTO' | 'MÉDIO' | 'BAIXO';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  actions: string[];
}

export interface KPITarget {
  metric: string;
  current: number;
  target: number;
  variance: number;
  trend: 'POSITIVA' | 'NEGATIVA' | 'ESTÁVEL';
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  stockAccuracy: number;
  fillRate: number;
  inventoryTurnover: number;
  daysOfInventory: number;
  cashToInventory: number;
  obsoleteInventory: number;
  shrinkage: number;
  demandForecastAccuracy: number;
}