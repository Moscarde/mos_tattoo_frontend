import React from 'react';
import DashboardBlock from './DashboardBlock';

/**
 * Componente responsável pelo layout do grid de dashboard
 * Constrói o grid dinamicamente baseado no schema
 */
function DashboardGrid({ schema, blocks }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="dashboard-empty">
        <p>Nenhum bloco disponível neste dashboard</p>
      </div>
    );
  }

  const gridColumns = schema?.grid?.columns || 12;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gap: '20px',
    padding: '20px',
  };

  return (
    <div className="dashboard-grid" style={gridStyle}>
      {blocks.map((block) => {
        const colSpan = block.layout?.colSpan || 6;
        const rowSpan = block.layout?.rowSpan || 1;

        const blockStyle = {
          gridColumn: `span ${Math.min(colSpan, gridColumns)}`,
          gridRow: `span ${rowSpan}`,
        };

        return (
          <div key={block.id} style={blockStyle}>
            <DashboardBlock block={block} />
          </div>
        );
      })}
    </div>
  );
}

export default DashboardGrid;
