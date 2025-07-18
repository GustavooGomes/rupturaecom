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

export interface DashboardMetrics {
  totalSKUs: number;
  itemsWithZeroStock: number;
  totalOpenOrders: number;
  totalStockUnits: number;
  totalSales30d: number;
}

export interface FilterOptions {
  tiposProduto: string[];
  tamanhos: string[];
  colecoes: string[];
  linhasComerciais: string[];
}