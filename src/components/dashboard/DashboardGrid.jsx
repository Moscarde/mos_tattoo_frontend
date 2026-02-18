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

  // Processa blocos para empilhar métricas consecutivas com rowSpan: 1
  const processBlocks = () => {
    const processed = [];
    let i = 0;

    while (i < blocks.length) {
      const block = blocks[i];
      const isMetric = block.chart?.type === 'metric';
      const rowSpan = block.layout?.rowSpan || 1;
      const colSpan = block.layout?.colSpan || 6;

      // Verifica se é uma métrica com rowSpan: 1 e se há outra métrica similar após ela
      if (isMetric && rowSpan === 1 && i + 1 < blocks.length) {
        const nextBlock = blocks[i + 1];
        const nextIsMetric = nextBlock.chart?.type === 'metric';
        const nextRowSpan = nextBlock.layout?.rowSpan || 1;
        const nextColSpan = nextBlock.layout?.colSpan || 6;

        // Se o próximo também é métrica com rowSpan: 1 e mesmo colSpan, empilhar
        if (nextIsMetric && nextRowSpan === 1 && nextColSpan === colSpan) {
          processed.push({
            type: 'stacked',
            colSpan: colSpan,
            blocks: [block, nextBlock],
          });
          i += 2; // Pula os dois blocos
          continue;
        }
      }

      // Bloco normal
      processed.push({
        type: 'single',
        colSpan: colSpan,
        rowSpan: rowSpan,
        block: block,
      });
      i++;
    }

    return processed;
  };

  const processedBlocks = processBlocks();

  // Altura base: 140px por unidade de rowSpan
  // rowSpan: 1 = 140px | rowSpan: 2 = 300px (140×2 + 20px gap)
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gridAutoRows: '140px',
    gap: '20px',
    padding: '20px',
  };

  return (
    <div className="dashboard-grid" style={gridStyle}>
      {processedBlocks.map((item, index) => {
        if (item.type === 'stacked') {
          // Container para métricas empilhadas (ocupa 2 rowSpans = 300px)
          const blockStyle = {
            gridColumn: `span ${Math.min(item.colSpan, gridColumns)}`,
            gridRow: 'span 2',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          };

          return (
            <div key={`stacked-${index}`} style={blockStyle} data-block-type="stacked">
              {item.blocks.map((block) => {
                const isMetric = block.chart?.type === 'metric';
                const wrapperClass = `dashboard-block-wrapper ${isMetric ? 'metric-wrapper' : ''}`;
                
                return (
                  <div 
                    key={block.id} 
                    style={{ 
                      height: 'calc(50% - 10px)', // 50% do container menos metade do gap
                      minHeight: '140px',
                    }}
                    className={wrapperClass}
                  >
                    <DashboardBlock block={block} />
                  </div>
                );
              })}
            </div>
          );
        } else {
          // Bloco normal
          const blockStyle = {
            gridColumn: `span ${Math.min(item.colSpan, gridColumns)}`,
            gridRow: `span ${item.rowSpan}`,
          };

          const isMetric = item.block.chart?.type === 'metric';
          const wrapperClass = `dashboard-block-wrapper ${isMetric ? 'metric-wrapper' : ''}`;

          return (
            <div 
              key={item.block.id} 
              style={blockStyle} 
              className={wrapperClass}
              data-block-type="single"
            >
              <DashboardBlock block={item.block} />
            </div>
          );
        }
      })}
    </div>
  );
}

export default DashboardGrid;
