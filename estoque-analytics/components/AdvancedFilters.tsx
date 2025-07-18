'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { FilterOptions, ExtendedProduct } from '@/types/product';

interface AdvancedFiltersProps {
  products: ExtendedProduct[];
  filterOptions: FilterOptions;
  onFilterChange: (filteredProducts: ExtendedProduct[]) => void;
  className?: string;
}

export const AdvancedFilters = ({ 
  products, 
  filterOptions, 
  onFilterChange,
  className = ""
}: AdvancedFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    tiposProduto: [] as string[],
    tamanhos: [] as string[],
    colecoes: [] as string[],
    linhasComerciais: [] as string[],
    riscos: [] as string[],
    classificacoesABC: [] as string[],
    statusOperacional: [] as string[]
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Aplicar filtros sempre que houver mudanças
  useEffect(() => {
    let filtered = [...products];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product['Nome Produto'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        product['ID VTEX'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Tamanho.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros por categoria
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter(product => {
          switch (key) {
            case 'tiposProduto':
              return values.includes(product['Tipo. Produto']);
            case 'tamanhos':
              return values.includes(product.Tamanho);
            case 'colecoes':
              return values.includes(product['Coleção Atual']);
            case 'linhasComerciais':
              return values.includes(product['Descrição Linha Comercial']);
            case 'riscos':
              return values.includes(product.risco);
            case 'classificacoesABC':
              return values.includes(product.classificacaoABC);
            case 'statusOperacional':
              return values.includes(product.statusOperacional);
            default:
              return true;
          }
        });
      }
    });

    onFilterChange(filtered);
  }, [searchTerm, selectedFilters, products, onFilterChange]);

  const handleFilterChange = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedFilters({
      tiposProduto: [],
      tamanhos: [],
      colecoes: [],
      linhasComerciais: [],
      riscos: [],
      classificacoesABC: [],
      statusOperacional: []
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).reduce((sum, filters) => sum + filters.length, 0) +
           (searchTerm ? 1 : 0);
  };

  const FilterSection = ({ 
    title, 
    options, 
    category, 
    colorClass = "bg-blue-100 text-blue-800" 
  }: {
    title: string;
    options: string[];
    category: keyof typeof selectedFilters;
    colorClass?: string;
  }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {options.map(option => (
          <button
            key={option}
            onClick={() => handleFilterChange(category, option)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              selectedFilters[category].includes(option)
                ? colorClass
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="p-4">
        {/* Barra de busca principal */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, ID VTEX ou tamanho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros</span>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {getActiveFiltersCount()}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Limpar</span>
            </button>
          )}
        </div>

        {/* Filtros expandidos */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FilterSection
                title="Tipo de Produto"
                options={filterOptions.tiposProduto}
                category="tiposProduto"
                colorClass="bg-blue-100 text-blue-800"
              />
              
              <FilterSection
                title="Tamanho"
                options={filterOptions.tamanhos}
                category="tamanhos"
                colorClass="bg-green-100 text-green-800"
              />
              
              <FilterSection
                title="Coleção"
                options={filterOptions.colecoes}
                category="colecoes"
                colorClass="bg-purple-100 text-purple-800"
              />
              
              <FilterSection
                title="Linha Comercial"
                options={filterOptions.linhasComerciais}
                category="linhasComerciais"
                colorClass="bg-orange-100 text-orange-800"
              />
              
              <FilterSection
                title="Nível de Risco"
                options={filterOptions.riscos}
                category="riscos"
                colorClass="bg-red-100 text-red-800"
              />
              
              <FilterSection
                title="Classificação ABC"
                options={filterOptions.classificacoesABC}
                category="classificacoesABC"
                colorClass="bg-yellow-100 text-yellow-800"
              />
            </div>

            <FilterSection
              title="Status Operacional"
              options={filterOptions.statusOperacional}
              category="statusOperacional"
              colorClass="bg-indigo-100 text-indigo-800"
            />
          </div>
        )}
      </div>
    </div>
  );
};