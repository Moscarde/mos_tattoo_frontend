# Documentação de Visualização de Dados (Front-end)

Este documento detalha a implementação da camada de visualização de dados do projeto, construída com **React** e **Recharts**. O sistema utiliza um componente renderizador genérico que consome uma estrutura de dados padronizada da API e a adapta para os gráficos específicos.

## 1. Componentes de Visualização

O núcleo da visualização é o componente `ChartRenderer.jsx`, que atua como uma fábrica de gráficos. Ele decide qual tipo de visualização renderizar com base na propriedade `chart.type` recebida do back-end.

| Tipo (API) | Componente Recharts | Descrição e Caso de Uso |
| :--- | :--- | :--- |
| `bar` | `<BarChart>` | **Gráfico de Barras Vertical**. Usado para comparar categorias discretas ou séries temporais curtas. |
| `barh` | `<BarChart layout="vertical">` | **Gráfico de Barras Horizontal**. Implementação customizada com **scroll infinito virtual**. Ideal para listas longas (ex: Vendas por Vendedor), onde os rótulos do eixo Y precisam de mais espaço. |
| `line` | `<LineChart>` | **Gráfico de Linha**. Utilizado para tendências ao longo do tempo (ex: Evolução de Vendas). Usa interpolação `monotone` para suavizar as curvas. |
| `pie` | `<PieChart>` | **Gráfico de Pizza**. Mostra a composição de um todo. Os dados são agregados automaticamente para exibir a proporção de cada série. |
| `metric` | `<div>` (HTML) | **Card de Métrica**. Não usa Recharts. Exibe um "Big Number" com formatação abreviada (ex: R$ 1,5 M). |
| `table` | `<table>` (HTML) | **Tabela de Dados**. Exibe os dados brutos em formato tabular quando a visualização gráfica não é suficiente. |

## 2. Contratos de Dados (Interfaces)

A API fornece os dados em um formato **colunar** (arrays separados para Eixo X e Séries), otimizado para transferência. O `ChartRenderer` transforma isso para o formato **orientado a linha** (array de objetos) exigido pelo Recharts.

### Formato da API (Input)

```json
{
  "chart": { "type": "bar" },
  "data": {
    "x": ["2023-01", "2023-02", "2023-03"],
    "series": [
      {
        "label": "Vendas",
        "values": [1200, 1900, 1500]
      },
      {
        "label": "Metas",
        "values": [1000, 1000, 1000]
      }
    ]
  }
}
```

### Formato Recharts (Transformado)

O componente executa a função `transformData()` para gerar:

```javascript
[
  { "name": "2023-01", "Vendas": 1200, "Metas": 1000 },
  { "name": "2023-02", "Vendas": 1900, "Metas": 1000 },
  { "name": "2023-03", "Vendas": 1500, "Metas": 1000 }
]
```

> **Nota:** Essa transformação desacopla o front-end da estrutura do banco de dados, permitindo que o Recharts itere sobre um array único para renderizar eixos e legendas.

## 3. Ajustes e Customizações

O projeto aplica várias customizações sobre os componentes padrão do Recharts para melhorar a UX e a legibilidade.

### Formatação de Valores (`abbreviateValue`)
Uma função utilitária formata números grandes automaticamente, adicionando sufixos e localidade (pt-BR):
- `1.500.000` -> **1,5 M**
- `2.300` -> **2,3 Mil**
- `R$ 150,00` -> **R$ 150** (para métricas)

### Tooltips Personalizados
Substituímos o tooltip padrão por um componente `<CustomTooltip />` que:
- Possui bordas e cores alinhadas ao tema (Borda Dourada).
- Exibe o nome completo da série e o valor formatado (não abreviado) para precisão.

### Scroll em Gráficos de Barras (`barh`)
Para evitar que gráficos com muitos itens (ex: 50 vendedores) fiquem ilegíveis:
- Calculamos a altura dinamicamente: `height = items * 30px + 60px`.
- Envolvemos o gráfico em um container com `overflow-y: auto`.
- Adicionamos indicadores visuais de scroll quando necessário.

### Esquema de Cores
Utilizamos um array de cores constante (`COLORS`) que cicla automaticamente caso haja mais séries do que cores definidas. As cores seguem escalas de Amarelo (primário), Azul e Vermelho.

## 4. Guia de Manutenção

### Como Adicionar um Novo Tipo de Gráfico
1. Abra `src/components/dashboard/ChartRenderer.jsx`.
2. Adicione uma nova condicional `if (chartType === 'novo_tipo')`.
3. Utilize `transformData()` para obter os dados.
4. Retorne o componente Recharts desejado dentro de um `<ResponsiveContainer>`.

```jsx
if (chartType === 'area') {
  const chartData = transformData();
  return (
    <ResponsiveContainer>
      <AreaChart data={chartData}>
        {/* ...configuração */}
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

### Alterar Cores Padrão
Edite a constante `COLORS` no topo de `ChartRenderer.jsx`. A ordem define a prioridade de atribuição às séries.

### Ajustar Formatação de Moeda/Data
Edite as funções `abbreviateValue` (para números) e `formatXValue` (para datas) dentro de `ChartRenderer.jsx`. Atualmente, o sistema detecta automaticamente strings de data ISO (`YYYY-MM-DD`) e as formata para `DD/MM`.

## 5. Propriedades vs. Visualização

| Visualização | Tipo Recharts | Fonte de Dados (Exemplo) | Customização Principal |
| :--- | :--- | :--- | :--- |
| **Vendas por Dia** | `<BarChart>` | `data.x`: Datas, `data.series`: Valores | Eixo X formatado como DD/MM |
| **Ranking de Vendedores** | `<BarChart layout="vertical">` | `data.x`: Nomes, `data.series`: Vendas | Container com scroll vertical e labels customizados |
| **Evolução Mensal** | `<LineChart>` | `data.x`: Meses, `data.series`: Faturamento | Linhas `monotone` (suaves) e pontos marcadores |
| **Mix de Produtos** | `<PieChart>` | `data.series`: Categorias | Tooltip com % automática e legenda interativa |
| **Total Faturado** | N/A (Metric) | `data.series[0].values[0]` | Formatação abreviada (ex: R$ 1,2 M) |
