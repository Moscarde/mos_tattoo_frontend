import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboards } from '../services/dashboard';

/**
 * Página de listagem de dashboards disponíveis
 * Rota: /app/dashboards
 */
function DashboardList() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    setLoading(true);
    setError('');

    const result = await getDashboards();

    if (result.success) {
      setDashboards(result.data.results || []);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Carregando dashboards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboards</h1>
        </div>
        <div className="error-message">{error}</div>
        <button onClick={loadDashboards} className="btn btn-primary">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboards Disponíveis</h1>
        <p className="page-subtitle">
          Selecione um dashboard para visualizar os dados da sua unidade
        </p>
      </div>

      {dashboards.length === 0 ? (
        <div className="dashboard-empty">
          <p>Nenhum dashboard disponível no momento</p>
        </div>
      ) : (
        <div className="dashboard-list-grid">
          {dashboards.map((dashboard) => (
            <Link
              key={dashboard.id}
              to={`/app/dashboards/${dashboard.id}`}
              className="dashboard-card"
            >
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">{dashboard.template_nome}</h3>
                {!dashboard.ativo && (
                  <span className="dashboard-badge-inactive">Inativo</span>
                )}
              </div>
              <div className="dashboard-card-body">
                <div className="dashboard-card-info">
                  <span className="info-label">Unidade:</span>
                  <span className="info-value">{dashboard.unidade_nome}</span>
                </div>
                <div className="dashboard-card-info">
                  <span className="info-label">Código:</span>
                  <span className="info-value">{dashboard.unidade_codigo}</span>
                </div>
              </div>
              <div className="dashboard-card-footer">
                <span className="dashboard-card-link">
                  Ver dashboard →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardList;
