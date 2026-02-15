import React from 'react';
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
function ChartRenderer({ chartType, data }) {
  if (!data || !data.x || !data.series) {
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

  const chartData = transformData();

  // Renderizar gráfico de barras
  if (chartType === 'bar') {
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
