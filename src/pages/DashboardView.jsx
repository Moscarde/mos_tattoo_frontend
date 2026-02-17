import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getDashboardData } from '../services/dashboard';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import DashboardFilters from '../components/dashboard/DashboardFilters';

/**
 * Página de visualização de um dashboard específico
 * Rota: /app/dashboards/:id
 */
function DashboardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [dashboard, setDashboard] = useState(null);
  const [availableFilters, setAvailableFilters] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, [id, searchParams]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    // Converter query params da URL para objeto
    const queryParams = {};
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const result = await getDashboardData(id, queryParams);

    if (result.success) {
      setDashboard(result.data);
      
      // Extrair filtros disponíveis se existirem
      if (result.data.filters?.available) {
        setAvailableFilters(result.data.filters.available);
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
    setIsInitialLoad(false);
  };

  const handleApplyFilters = (queryParams) => {
    // Atualizar URL com novos query params
    setSearchParams(queryParams);
    // O useEffect vai triggerar loadDashboard automaticamente
  };

  const handleBack = () => {
    navigate('/app/dashboards');
  };

  // Loading inicial - tela cheia
  if (isInitialLoad) {
    return (
      <div className="container">
        <div className="loading">Carregando dashboard...</div>
      </div>
    );
  }

  // Erro
  if (error) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <button onClick={handleBack} className="btn btn-secondary">
            ← Voltar
          </button>
        </div>
        <div className="error-message">{error}</div>
        <button onClick={loadDashboard} className="btn btn-primary">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <button onClick={handleBack} className="btn btn-secondary">
            ← Voltar
          </button>
        </div>
        <div className="dashboard-empty">Dashboard não encontrado</div>
      </div>
    );
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-view-header">
        <button onClick={handleBack} className="btn btn-secondary">
          ← Voltar
        </button>
        <div className="dashboard-view-info">
          <h1 className="dashboard-view-title">{dashboard.template_nome}</h1>
          {dashboard.unidade && (
            <p className="dashboard-view-subtitle">
              {dashboard.unidade.nome} ({dashboard.unidade.codigo})
            </p>
          )}
        </div>
        <button onClick={loadDashboard} className="btn btn-secondary">
          🔄 Atualizar
        </button>
      </div>

      {/* Filtros dinâmicos */}
      {availableFilters && (
        <DashboardFilters 
          availableFilters={availableFilters}
          appliedFilters={dashboard.filters?.applied || {}}
          onApplyFilters={handleApplyFilters}
          loading={loading}
        />
      )}

      {/* Overlay de loading durante refetch */}
      <div className={`dashboard-content ${loading ? 'loading' : ''}`}>
        {loading && (
          <div className="dashboard-loading-overlay">
            <div className="loading-spinner">Atualizando gráficos...</div>
          </div>
        )}
        
        <DashboardGrid 
          schema={dashboard.schema} 
          blocks={dashboard.blocks || []} 
        />
      </div>
    </div>
  );
}

export default DashboardView;
