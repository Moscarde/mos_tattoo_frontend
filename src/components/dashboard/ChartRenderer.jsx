import React, { useRef, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Componente genérico para renderização de gráficos
 * Não contém lógica de negócio, apenas interpreta a estrutura declarativa
 */
function ChartRenderer({ chart, data }) {
  const scrollableRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const chartType = chart?.type;
  
  // Detectar overflow e posição do scroll
  useEffect(() => {
    if (scrollableRef.current && chartType === 'barh') {
      const element = scrollableRef.current;
      
      const checkOverflow = () => {
        if (element) {
          const hasScroll = element.scrollHeight > element.clientHeight;
          setHasOverflow(hasScroll);
          
          // Verificar se não está no final
          const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
          setShowScrollIndicator(hasScroll && !isAtBottom);
        }
      };
      
      // Verificar overflow após renderização
      checkOverflow();
      
      // Verificar novamente após animações do gráfico
      const timer = setTimeout(checkOverflow, 500);
      
      // Adicionar listener de scroll para esconder indicador
      const handleScroll = () => {
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 5;
        setShowScrollIndicator(hasOverflow && !isAtBottom);
      };
      
      element.addEventListener('scroll', handleScroll);
      
      return () => {
        clearTimeout(timer);
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [chartType, data, hasOverflow]);
  
  // Função para rolar para baixo
  const handleScrollDown = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({
        top: 150, // Rola 150px para baixo
        behavior: 'smooth'
      });
    }
  };
  
  // Validação de dados (diferente para cada tipo de gráfico)
  if (!data) {
    return <div className="chart-error">Dados insuficientes para renderizar o gráfico</div>;
  }

  // Para tipo table, validar columns e rows
  if (chartType === 'table' && (!data.columns || !data.rows)) {
    return <div className="chart-error">Dados insuficientes para renderizar a tabela</div>;
  }

  // Para outros tipos, validar x e series
  if (chartType !== 'table' && (!data.x || !data.series)) {
    return <div className="chart-error">Dados insuficientes para renderizar o gráfico</div>;
  }

  // Transformar dados do formato backend para formato Recharts
  const transformData = () => {
    const transformed = [];
    
    for (let i = 0; i < data.x.length; i++) {
      const point = { name: formatXValue(data.x[i]) };
      
      data.series.forEach((serie) => {
        if (serie.values && serie.values[i] !== undefined) {
          point[serie.label] = serie.values[i];
        }
      });
      
      transformed.push(point);
    }
    
    return transformed;
  };

  // Abreviar valores grandes (bilhões, milhões, etc)
  const abbreviateValue = (value, decimalPlaces = 2) => {
    if (typeof value !== 'number') {
      return { abbreviated: value, full: value };
    }

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    // Trilhões
    if (absValue >= 1e12) {
      const abbreviated = sign + (absValue / 1e12).toFixed(3).replace('.', ',') + ' tri';
      const full = value.toLocaleString('pt-BR', { 
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces 
      });
      return { abbreviated, full };
    }
    
    // Bilhões
    if (absValue >= 1e9) {
      const abbreviated = sign + (absValue / 1e9).toFixed(3).replace('.', ',') + ' bi';
      const full = value.toLocaleString('pt-BR', { 
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces 
      });
      return { abbreviated, full };
    }
    
    // Milhões
    if (absValue >= 1e6) {
      const abbreviated = sign + (absValue / 1e6).toFixed(3).replace('.', ',') + ' M';
      const full = value.toLocaleString('pt-BR', { 
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces 
      });
      return { abbreviated, full };
    }
    
    // Milhares
    if (absValue >= 1e3) {
      const abbreviated = sign + (absValue / 1e3).toFixed(3).replace('.', ',') + ' Mil';
      const full = value.toLocaleString('pt-BR', { 
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces 
      });
      return { abbreviated, full };
    }
    
    // Valores menores que 1000
    const formatted = value.toLocaleString('pt-BR', { 
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces 
    });
    return { abbreviated: formatted, full: formatted };
  };

  // Formatar valores do eixo X (datas, timestamps, etc)
  const formatXValue = (value) => {
    if (!value) return '';
    
    // Se for uma data ISO, formatar
    if (typeof value === 'string' && value.includes('T')) {
      const date = new Date(value);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
    
    return value;
  };

  // Cores do tema
  const COLORS = ['#FFD700', '#000000', '#FFA500', '#FFE55C', '#333333'];

  // Renderizar métrica (valor único)
  if (chartType === 'metric') {
    // Extrair o valor da primeira série
    const value = data.series?.[0]?.values?.[0];
    
    if (value === undefined || value === null) {
      return <div className="chart-error">Valor não disponível</div>;
    }

    // Aplicar formatação e abreviação
    const decimalPlaces = chart.metricDecimalPlaces ?? 0;
    const { abbreviated, full } = abbreviateValue(value, decimalPlaces);

    const prefix = chart.metricPrefix || '';
    const suffix = chart.metricSuffix || '';

    return (
      <div className="metric-display">
        <div 
          className="metric-value"
          title={`${prefix}${full}${suffix}`}
        >
          {prefix}{abbreviated}{suffix}
        </div>
      </div>
    );
  }

  // Renderizar tabela
  if (chartType === 'table') {
    const columns = data.columns || [];
    const rows = data.rows || [];

    if (columns.length === 0 || rows.length === 0) {
      return <div className="chart-error">Dados insuficientes para renderizar a tabela</div>;
    }

    // Função para formatar célula baseado no tipo
    const formatCell = (value, type) => {
      if (value === null || value === undefined) {
        return { display: '-', title: 'Valor não disponível' };
      }

      if (type === 'number') {
        const { abbreviated, full } = abbreviateValue(value, 2);
        return { display: abbreviated, title: full };
      }

      return { display: value, title: value };
    };

    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cellValue, cellIndex) => {
                  const columnType = columns[cellIndex]?.type || 'string';
                  const { display, title } = formatCell(cellValue, columnType);
                  
                  return (
                    <td 
                      key={cellIndex} 
                      className={columnType === 'number' ? 'numeric-cell' : ''}
                      title={title}
                    >
                      {display}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

    // Renderizar gráfico de barras horizontais
    if (chartType === 'barh') {
    const chartData = transformData();
    // Ajustado para 30px por item para combinar com a barra de 10px
    const itemCount = chartData.length;
    const calculatedHeight = itemCount * 30 + 60; 
    
    return (
        <div className="chart-container-with-indicator">
          <div className="chart-scrollable" ref={scrollableRef}>
            <ResponsiveContainer width="100%" height={calculatedHeight}>
              <BarChart 
                data={chartData} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  type="number"
                  stroke="#000000"
                  style={{ fontSize: '12px' }}
                  verticalAlign="top"
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  stroke="#000000"
                  style={{ fontSize: '11px' }}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '2px solid #FFD700',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                />
                {data.series.map((serie, index) => (
                  <Bar 
                    key={serie.label} 
                    dataKey={serie.label} 
                    fill={COLORS[index % COLORS.length]}
                    barSize={12} // <--- A espessura definida aqui
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {showScrollIndicator && (
            <div className="scroll-indicator" onClick={handleScrollDown}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
    );
    }
  // Renderizar gráfico de barras
  if (chartType === 'bar') {
    const chartData = transformData();
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            stroke="#000000"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#000000"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '2px solid #FFD700',
              borderRadius: '8px'
            }}
          />
          <Legend />
          {data.series.map((serie, index) => (
            <Bar 
              key={serie.label} 
              dataKey={serie.label} 
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Renderizar gráfico de linhas
  if (chartType === 'line') {
    const chartData = transformData();
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            stroke="#000000"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#000000"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '2px solid #FFD700',
              borderRadius: '8px'
            }}
          />
          <Legend />
          {data.series.map((serie, index) => (
            <Line 
              key={serie.label} 
              type="monotone" 
              dataKey={serie.label} 
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Renderizar gráfico de pizza
  if (chartType === 'pie') {
    const chartData = transformData();
    // Para pizza, agregar dados por label
    const pieData = data.series[0]?.values.map((value, index) => ({
      name: chartData[index]?.name || `Item ${index + 1}`,
      value: value,
    })) || [];

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '2px solid #FFD700',
              borderRadius: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Tipo de gráfico não suportado
  return (
    <div className="chart-error">
      Tipo de gráfico "{chartType}" não suportado
    </div>
  );
}

export default ChartRenderer;
