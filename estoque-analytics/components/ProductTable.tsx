'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductTableProps {
  products: Product[];
  title: string;
  isLinhaBranca?: boolean;
}

type SortField = 'Nome Produto' | 'Tamanho' | 'Estoque' | 'Pronta Entrega' | 'Venda 30d' | 'Multiplo';
type SortDirection = 'asc' | 'desc';

export const ProductTable = ({ products, title, isLinhaBranca = false }: ProductTableProps) => {
  const [sortField, setSortField] = useState<SortField>('Estoque');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Aplicar filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product['Nome Produto'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Tamanho.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar ordenação
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Converter para número se necessário
      if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [products, sortField, sortDirection, searchTerm]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left w-full hover:bg-gray-50 p-2 rounded"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  const getCoverageLevel = (stock: number, sales30d: number) => {
    if (sales30d === 0) return stock > 0 ? 100 : 0;
    const coverage = (stock / sales30d) * 30; // cobertura em dias
    return Math.min(coverage, 100);
  };

  const getCoverageColor = (level: number) => {
    if (level === 0) return 'bg-red-500';
    if (level < 15) return 'bg-yellow-500';
    if (level < 30) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const themeClasses = isLinhaBranca 
    ? 'bg-gray-50 border-gray-100' 
    : 'bg-white border-gray-200';

  return (
    <div className={`rounded-lg border ${themeClasses} shadow-sm`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <span className="text-sm text-gray-500">
              {filteredAndSortedProducts.length} produtos
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={isLinhaBranca ? 'bg-gray-100' : 'bg-gray-50'}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="Nome Produto">Produto</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="Tamanho">Tamanho</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="Estoque">Estoque</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="Pronta Entrega">Pronta Entrega</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="Multiplo">Múltiplo</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="Venda 30d">Vendas 30d</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cobertura
              </th>
            </tr>
          </thead>
          <tbody className={`${themeClasses} divide-y divide-gray-200`}>
            {filteredAndSortedProducts.map((product, index) => {
              const isRupture = product.Estoque === 0;
              const coverageLevel = getCoverageLevel(product.Estoque, product['Venda 30d']);
              
              return (
                <tr key={`${product['ID VTEX']}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product['Nome Produto']}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.Tamanho}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={isRupture ? 'text-red-600 font-semibold' : ''}>
                      {product.Estoque.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product['Pronta Entrega'].toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.Multiplo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isRupture 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isRupture ? (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Ruptura
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Disponível
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product['Venda 30d'].toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getCoverageColor(coverageLevel)}`}
                          style={{ width: `${Math.min(coverageLevel, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-12">
                        {coverageLevel.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};