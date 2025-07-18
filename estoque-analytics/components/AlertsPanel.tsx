'use client';

import { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  X,
  Clock,
  TrendingUp,
  Package,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { StockAlert } from '@/types/product';

interface AlertsPanelProps {
  alerts: StockAlert[];
}

export const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRÍTICO': return <AlertTriangle className="w-5 h-5" />;
      case 'ALTO': return <AlertCircle className="w-5 h-5" />;
      case 'MÉDIO': return <Info className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRÍTICO': return 'bg-red-50 border-red-200 text-red-800';
      case 'ALTO': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'MÉDIO': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RUPTURA': return <Package className="w-4 h-4" />;
      case 'EXCESSO': return <TrendingUp className="w-4 h-4" />;
      case 'SAZONALIDADE': return <Clock className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAcknowledgedAlerts(prev => new Set(prev).add(alertId));
  };

  // Filtros e paginação usando useMemo para performance
  const filteredAlerts = useMemo(() => {
    let filtered = alerts.filter(alert => !acknowledgedAlerts.has(alert.id));

    // Filtro por severidade
    if (filterSeverity !== 'ALL') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }

    // Filtro por tipo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    // Filtro por busca (nome do produto ou ID)
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.productId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [alerts, acknowledgedAlerts, filterSeverity, filterType, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * alertsPerPage;
    return filteredAlerts.slice(startIndex, startIndex + alertsPerPage);
  }, [filteredAlerts, currentPage, alertsPerPage]);

  // Reset página quando filtros mudam
  useState(() => {
    setCurrentPage(1);
  });

  const severityCounts = alerts.reduce((counts, alert) => {
    if (!acknowledgedAlerts.has(alert.id)) {
      counts[alert.severity] = (counts[alert.severity] || 0) + 1;
    }
    return counts;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas de Estoque
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredAlerts.length} de {alerts.length - acknowledgedAlerts.size})
            </span>
          </h3>
        </div>

        {/* Filtros avançados */}
        <div className="mt-4 space-y-3">
          {/* Busca */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por produto ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Severidade: Todas</option>
              <option value="CRÍTICO">🔴 Críticos ({severityCounts['CRÍTICO'] || 0})</option>
              <option value="ALTO">🟠 Altos ({severityCounts['ALTO'] || 0})</option>
              <option value="MÉDIO">🟡 Médios ({severityCounts['MÉDIO'] || 0})</option>
              <option value="BAIXO">🔵 Baixos ({severityCounts['BAIXO'] || 0})</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Tipo: Todos</option>
              <option value="RUPTURA">🚨 Ruptura</option>
              <option value="EXCESSO">📈 Excesso</option>
              <option value="SAZONALIDADE">🌊 Sazonalidade</option>
              <option value="QUALIDADE">⚠️ Qualidade</option>
            </select>

            {(filterSeverity !== 'ALL' || filterType !== 'ALL' || searchTerm) && (
              <button
                onClick={() => {
                  setFilterSeverity('ALL');
                  setFilterType('ALL');
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
        
        {/* Resumo de severidades */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(severityCounts).map(([severity, count]) => (
            <span
              key={severity}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(severity)}`}
            >
              {getSeverityIcon(severity)}
              <span className="ml-1">{severity}: {count}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {acknowledgedAlerts.size === alerts.length 
              ? 'Todos os alertas foram reconhecidos' 
              : searchTerm || filterSeverity !== 'ALL' || filterType !== 'ALL'
              ? 'Nenhum alerta encontrado com os filtros aplicados'
              : 'Nenhum alerta ativo'
            }
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {paginatedAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 ${getSeverityColor(alert.severity)} p-1 rounded`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(alert.type)}
                        <span className="text-sm font-medium text-gray-900">
                          {alert.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {alert.message}
                      </p>
                      
                      {/* Ações recomendadas */}
                      {alert.actions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Ações Recomendadas:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {alert.actions.map((action, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Reconhecer alerta"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * alertsPerPage) + 1} a {Math.min(currentPage * alertsPerPage, filteredAlerts.length)} de {filteredAlerts.length} alertas
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm transition-colors ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="text-gray-500 px-2">...</span>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
        )}
      </div>
    </div>
  );
};