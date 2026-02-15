import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

function DashboardHome() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleGoToDashboards = () => {
    navigate('/app/dashboards');
  };

  return (
    <div className="container">
      <div className="dashboard-welcome">
        <h1 className="dashboard-title">
          Bem-vindo de volta!
        </h1>
        
        {user && (
          <p className="dashboard-subtitle">
            {user.name || user.username}
          </p>
        )}

        <p className="dashboard-description">
          Acesse os dashboards gerenciais da sua unidade
        </p>

        <div className="dashboard-actions">
          <button 
            className="btn btn-primary"
            onClick={handleGoToDashboards}
          >
            Ir para dashboards
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
