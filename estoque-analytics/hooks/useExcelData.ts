'use client';

import { useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Product, DashboardMetrics, FilterOptions } from '@/types/product';

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

  // Métricas do dashboard
  const dashboardMetrics = useMemo((): DashboardMetrics => {
    if (products.length === 0) {
      return {
        totalSKUs: 0,
        itemsWithZeroStock: 0,
        totalOpenOrders: 0,
        totalStockUnits: 0,
        totalSales30d: 0
      };
    }

    return {
      totalSKUs: products.length,
      itemsWithZeroStock: products.filter(p => p.Estoque === 0).length,
      totalOpenOrders: products.reduce((sum, p) => sum + p['Pedidos em Aberto'], 0),
      totalStockUnits: products.reduce((sum, p) => sum + p.Estoque, 0),
      totalSales30d: products.reduce((sum, p) => sum + p['Venda 30d'], 0)
    };
  }, [products]);

  // Filtros disponíveis
  const filterOptions = useMemo((): FilterOptions => {
    if (products.length === 0) {
      return {
        tiposProduto: [],
        tamanhos: [],
        colecoes: [],
        linhasComerciais: []
      };
    }

    return {
      tiposProduto: [...new Set(products.map(p => p['Tipo. Produto']).filter(Boolean))],
      tamanhos: [...new Set(products.map(p => p.Tamanho).filter(Boolean))],
      colecoes: [...new Set(products.map(p => p['Coleção Atual']).filter(Boolean))],
      linhasComerciais: [...new Set(products.map(p => p['Descrição Linha Comercial']).filter(Boolean))]
    };
  }, [products]);

  // Produtos filtrados por travesseiros
  const travesseiroProducts = useMemo(() => {
    return products.filter(p => 
      p['Tipo. Produto'] === 'Travesseiro' || 
      p['Tipo. Produto'] === 'Protetor de Travesseiro'
    );
  }, [products]);

  // Produtos da linha branca
  const linhaBrancaProducts = useMemo(() => {
    return products.filter(p => 
      p['Descrição Linha Comercial'] === 'Linha Branca'
    );
  }, [products]);

  return {
    products,
    loading,
    error,
    parseExcelFile,
    dashboardMetrics,
    filterOptions,
    travesseiroProducts,
    linhaBrancaProducts
  };
};