import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  subDays, 
  parseISO, 
  format 
} from 'date-fns';

const DashboardFilters = ({ availableFilters, appliedFilters, onApplyFilters, loading }) => {
  // Estado do formulário
  const [period, setPeriod] = useState('total');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categoricalSelections, setCategoricalSelections] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const dropdownRefs = useRef({});

  // Inicializar seleções categóricas quando availableFilters muda
  useEffect(() => {
    if (availableFilters?.categorical) {
      const initialSelections = {};
      availableFilters.categorical.forEach(filter => {
        // Por padrão, todos os valores estão selecionados
        initialSelections[filter.field] = [...filter.values];
      });
      setCategoricalSelections(initialSelections);
    }
  }, [availableFilters]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(openDropdowns).forEach(field => {
        if (openDropdowns[field] && dropdownRefs.current[field] && 
            !dropdownRefs.current[field].contains(event.target)) {
          setOpenDropdowns(prev => ({ ...prev, [field]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdowns]);

  // Calcular datas baseado no período selecionado
  useEffect(() => {
    if (!availableFilters?.temporal) return;

    const today = new Date();
    let newStartDate = null;
    let newEndDate = null;

    switch (period) {
      case 'yesterday':
        const yesterday = subDays(today, 1);
        newStartDate = yesterday;
        newEndDate = yesterday;
        break;
      
      case 'current_month':
        newStartDate = startOfMonth(today);
        newEndDate = endOfMonth(today);
        break;
      
      case 'previous_month':
        const lastMonth = subMonths(today, 1);
        newStartDate = startOfMonth(lastMonth);
        newEndDate = endOfMonth(lastMonth);
        break;
      
      case 'custom':
        // Não altera as datas - usuário escolhe manualmente
        return;
      
      case 'total':
      default:
        // Período total - sem filtro de data
        newStartDate = null;
        newEndDate = null;
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, [period, availableFilters]);

  // Handlers para filtros categóricos
  const handleSelectAll = (field) => {
    const filter = availableFilters.categorical.find(f => f.field === field);
    if (filter) {
      setCategoricalSelections(prev => ({
        ...prev,
        [field]: [...filter.values]
      }));
    }
  };

  const handleDeselectAll = (field) => {
    setCategoricalSelections(prev => ({
      ...prev,
      [field]: []
    }));
  };

  const handleToggleValue = (field, value) => {
    setCategoricalSelections(prev => {
      const currentValues = prev[field] || [];
      const isSelected = currentValues.includes(value);
      
      return {
        ...prev,
        [field]: isSelected 
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  const toggleDropdown = (field) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Construir query params para enviar ao backend
  const buildQueryParams = () => {
    const params = {};

    // Filtros temporais
    if (availableFilters?.temporal && period !== 'total') {
      const { field } = availableFilters.temporal;
      
      if (startDate) {
        params[`${field}__gte`] = format(startDate, 'yyyy-MM-dd');
      }
      
      if (endDate) {
        params[`${field}__lte`] = format(endDate, 'yyyy-MM-dd');
      }
    }

    // Filtros categóricos
    if (availableFilters?.categorical) {
      availableFilters.categorical.forEach(filter => {
        const selectedValues = categoricalSelections[filter.field] || [];
        
        // Só adiciona o filtro se não estiver com todos selecionados (otimização)
        if (selectedValues.length > 0 && selectedValues.length < filter.values.length) {
          params[`${filter.field}__in`] = selectedValues.join(',');
        } else if (selectedValues.length === 0) {
          // Se nenhum selecionado, enviar array vazio para não trazer nada
          params[`${filter.field}__in`] = '';
        }
        // Se todos estão selecionados, não envia o parâmetro (equivalente a não filtrar)
      });
    }

    return params;
  };

  // Handler para aplicar filtros
  const handleApply = (e) => {
    e.preventDefault();
    const queryParams = buildQueryParams();
    onApplyFilters(queryParams);
    
    // Em mobile, colapsar após aplicar
    if (window.innerWidth <= 768) {
      setIsExpanded(false);
    }
  };

  // Handler para limpar filtros
  const handleClear = (e) => {
    e.preventDefault();
    
    // Reset período
    setPeriod('total');
    setStartDate(null);
    setEndDate(null);
    
    // Reset categóricos para todos selecionados
    if (availableFilters?.categorical) {
      const allSelected = {};
      availableFilters.categorical.forEach(filter => {
        allSelected[filter.field] = [...filter.values];
      });
      setCategoricalSelections(allSelected);
    }
    
    // Aplicar filtros vazios
    onApplyFilters({});
    
    // Em mobile, colapsar após limpar
    if (window.innerWidth <= 768) {
      setIsExpanded(false);
    }
  };

  // Se não há filtros disponíveis, não renderiza nada
  if (!availableFilters || (!availableFilters.temporal && !availableFilters.categorical?.length)) {
    return null;
  }

  const hasTemporalFilter = !!availableFilters.temporal;
  const hasCategoricalFilters = availableFilters.categorical?.length > 0;
  const isCustomPeriod = period === 'custom';
  const isTemporalDisabled = !hasTemporalFilter;

  // Parsear min/max dates do filtro temporal se disponível
  let minAllowedDate = null;
  let maxAllowedDate = null;
  
  if (availableFilters?.temporal) {
    try {
      if (availableFilters.temporal.min) {
        minAllowedDate = parseISO(availableFilters.temporal.min.split(' ')[0]); // Pega apenas a parte da data
      }
      if (availableFilters.temporal.max) {
        maxAllowedDate = parseISO(availableFilters.temporal.max.split(' ')[0]); // Pega apenas a parte da data
      }
    } catch (error) {
      console.error('Erro ao parsear datas min/max do filtro temporal:', error);
    }
  }

  return (
    <div className="dashboard-filters">
      {/* Botão toggle para mobile */}
      <button 
        className="dashboard-filters-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <span>Filtros</span>
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {/* Conteúdo dos filtros */}
      <form 
        className={`dashboard-filters-content ${isExpanded ? 'expanded' : ''}`}
        onSubmit={handleApply}
      >
        <div className="filters-grid">
          {/* Filtros Temporais */}
          {hasTemporalFilter && (
            <>
              <div className="filter-group">
                <label className="filter-label">Período</label>
                <select 
                  className="filter-select"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  disabled={loading || isTemporalDisabled}
                >
                  <option value="total">Período Total</option>
                  <option value="yesterday">Ontem</option>
                  <option value="current_month">Mês Atual</option>
                  <option value="previous_month">Mês Anterior</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Data Inicial</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="filter-date-input"
                  disabled={loading || isTemporalDisabled || !isCustomPeriod}
                  placeholderText="Selecione a data inicial"
                  minDate={minAllowedDate}
                  maxDate={endDate || maxAllowedDate || new Date()}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Data Final</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="filter-date-input"
                  disabled={loading || isTemporalDisabled || !isCustomPeriod}
                  placeholderText="Selecione a data final"
                  minDate={startDate || minAllowedDate}
                  maxDate={maxAllowedDate || new Date()}
                />
              </div>
            </>
          )}

          {!hasTemporalFilter && (
            <div className="filter-group filter-disabled-message">
              <p>Filtros temporais não disponíveis para este dashboard</p>
            </div>
          )}

          {/* Filtros Categóricos */}
          {hasCategoricalFilters && availableFilters.categorical.map(filter => {
            const selectedValues = categoricalSelections[filter.field] || [];
            const allSelected = selectedValues.length === filter.values.length;
            const noneSelected = selectedValues.length === 0;
            const isOpen = openDropdowns[filter.field];
            const totalCount = filter.values.length;
            const selectedCount = selectedValues.length;

            return (
              <div 
                key={filter.field} 
                className="filter-group filter-categorical"
                ref={el => dropdownRefs.current[filter.field] = el}
              >
                <label className="filter-label">{filter.label}</label>
                
                {/* Campo de seleção compacto */}
                <button
                  type="button"
                  className="filter-categorical-trigger"
                  onClick={() => toggleDropdown(filter.field)}
                  disabled={loading}
                >
                  <span className="filter-trigger-text">
                    {selectedCount === totalCount 
                      ? 'Todos selecionados'
                      : selectedCount === 0
                      ? 'Nenhum selecionado'
                      : `${selectedCount} de ${totalCount} selecionados`
                    }
                  </span>
                  <span className={`filter-trigger-icon ${isOpen ? 'open' : ''}`}>▼</span>
                </button>

                {/* Dropdown com opções */}
                {isOpen && (
                  <div className="filter-categorical-dropdown">
                    <div className="filter-categorical-controls">
                      <button
                        type="button"
                        className="filter-control-btn"
                        onClick={() => handleSelectAll(filter.field)}
                        disabled={loading || allSelected}
                      >
                        ✓ Todos
                      </button>
                      <button
                        type="button"
                        className="filter-control-btn"
                        onClick={() => handleDeselectAll(filter.field)}
                        disabled={loading || noneSelected}
                      >
                        ✗ Nenhum
                      </button>
                    </div>

                    <div className="filter-categorical-options">
                      {filter.values.map(value => {
                        const isChecked = selectedValues.includes(value);
                        
                        return (
                          <label key={value} className="filter-checkbox-label">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleValue(filter.field, value)}
                              disabled={loading}
                            />
                            <span className="filter-checkbox-text">
                              {value}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ações */}
        <div className="filter-actions">
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            Limpar
          </button>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Atualizar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardFilters;
