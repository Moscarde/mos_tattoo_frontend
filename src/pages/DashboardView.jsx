import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/dashboard';
import DashboardGrid from '../components/dashboard/DashboardGrid';

/**
 * Página de visualização de um dashboard específico
 * Rota: /app/dashboards/:id
 */
function DashboardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, [id]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    const result = await getDashboardData(id);

    if (result.success) {
      setDashboard(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate('/app/dashboards');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Carregando dashboard...</div>
      </div>
    );
  }

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

      <DashboardGrid 
        schema={dashboard.schema} 
        blocks={dashboard.blocks || []} 
      />
    </div>
  );
}

export default DashboardView;
