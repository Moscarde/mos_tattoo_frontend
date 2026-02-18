import React from 'react';
import ChartRenderer from './ChartRenderer';

/**
 * Componente que encapsula um bloco individual do dashboard
 * Responsável por exibir título e renderizar o gráfico
 */
function DashboardBlock({ block }) {
  if (!block || !block.success) {
    return (
      <div className="dashboard-block dashboard-block-error">
        <div className="block-title">Erro ao carregar bloco</div>
        <div className="block-content">
          <p>Este bloco não pôde ser carregado</p>
        </div>
      </div>
    );
  }

  const { title, chart, data } = block;
  const isMetric = chart?.type === 'metric';

  return (
    <div className={`dashboard-block ${isMetric ? 'dashboard-block-metric' : ''}`}>
      <div className="block-title">{title}</div>
      <div className="block-content">
        {chart && data ? (
          <ChartRenderer chart={chart} data={data} />
        ) : (
          <div className="block-no-data">Sem dados disponíveis</div>
        )}
      </div>
    </div>
  );
}

export default DashboardBlock;
