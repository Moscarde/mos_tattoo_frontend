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
  
  // Manter referência dos filtros atualmente aplicados no backend
  // Isso garante que sempre reenviamos todos os filtros ativos
  const activeFiltersRef = useRef({});

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

  // Sincronizar estado do formulário com filtros aplicados e disponíveis
  // Suporta filtros adaptativos: valores disponíveis mudam baseado em outros filtros
  useEffect(() => {
    if (!availableFilters) return;

    // Sincronizar filtros temporais
    if (availableFilters.temporal) {
      const temporalApplied = appliedFilters?.[availableFilters.temporal.field];
      
      if (temporalApplied && (temporalApplied.gte || temporalApplied.lte)) {
        const gteDate = temporalApplied.gte ? parseISO(temporalApplied.gte) : null;
        const lteDate = temporalApplied.lte ? parseISO(temporalApplied.lte) : null;
        
        // Detectar se corresponde a algum preset
        const today = new Date();
        const yesterday = subDays(today, 1);
        const currentMonthStart = startOfMonth(today);
        const currentMonthEnd = endOfMonth(today);
        const previousMonth = subMonths(today, 1);
        const previousMonthStart = startOfMonth(previousMonth);
        const previousMonthEnd = endOfMonth(previousMonth);
        
        let detectedPeriod = 'custom';
        
        if (gteDate && lteDate) {
          const gteStr = format(gteDate, 'yyyy-MM-dd');
          const lteStr = format(lteDate, 'yyyy-MM-dd');
          const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
          const currentMonthStartStr = format(currentMonthStart, 'yyyy-MM-dd');
          const currentMonthEndStr = format(currentMonthEnd, 'yyyy-MM-dd');
          const previousMonthStartStr = format(previousMonthStart, 'yyyy-MM-dd');
          const previousMonthEndStr = format(previousMonthEnd, 'yyyy-MM-dd');
          
          if (gteStr === yesterdayStr && lteStr === yesterdayStr) {
            detectedPeriod = 'yesterday';
          } else if (gteStr === currentMonthStartStr && lteStr === currentMonthEndStr) {
            detectedPeriod = 'current_month';
          } else if (gteStr === previousMonthStartStr && lteStr === previousMonthEndStr) {
            detectedPeriod = 'previous_month';
          }
        }
        
        setPeriod(detectedPeriod);
        setStartDate(gteDate);
        setEndDate(lteDate);
      } else {
        // Sem filtro temporal aplicado
        setPeriod('total');
        setStartDate(null);
        setEndDate(null);
      }
    }

    // Sincronizar filtros categóricos com suporte a filtros adaptativos
    if (availableFilters.categorical) {
      const newSelections = {};
      
      availableFilters.categorical.forEach(filter => {
        const appliedValues = appliedFilters?.[filter.field];
        const availableValues = filter.values || [];
        
        if (appliedValues && appliedValues.in && Array.isArray(appliedValues.in)) {
          // Fazer interseção entre valores aplicados e valores disponíveis
          // Isso garante que valores que não existem mais (por filtros adaptativos) sejam removidos
          const intersection = appliedValues.in.filter(val => 
            availableValues.includes(val)
          );
          
          newSelections[filter.field] = intersection;
        } else {
          // Sem filtro aplicado: todos os valores disponíveis estão selecionados
          newSelections[filter.field] = [...availableValues];
        }
      });
      
      setCategoricalSelections(newSelections);
    }
    
    // Atualizar referência dos filtros ativos
    activeFiltersRef.current = appliedFilters || {};
  }, [appliedFilters, availableFilters]);

  // Calcular datas automaticamente quando usuário muda o período manualmente
  useEffect(() => {
    if (!availableFilters?.temporal) return;
    
    // Não recalcular se o período for 'custom' (usuário escolhe datas manualmente)
    if (period === 'custom') return;

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
  // IMPORTANTE: Sempre reenvia TODOS os filtros ativos para manter estado consistente
  const buildQueryParams = () => {
    const params = {};
    const activeFilters = activeFiltersRef.current || {};

    // Filtros temporais
    if (availableFilters?.temporal) {
      const { field } = availableFilters.temporal;
      
      if (period !== 'total' && (startDate || endDate)) {
        // Filtro temporal ativo no formulário
        if (startDate) {
          params[`${field}__gte`] = format(startDate, 'yyyy-MM-dd');
        }
        if (endDate) {
          params[`${field}__lte`] = format(endDate, 'yyyy-MM-dd');
        }
      } else if (activeFilters[field]) {
        // Reenvirar filtro temporal que estava aplicado antes
        if (activeFilters[field].gte) {
          params[`${field}__gte`] = activeFilters[field].gte;
        }
        if (activeFilters[field].lte) {
          params[`${field}__lte`] = activeFilters[field].lte;
        }
      }
    }

    // Filtros categóricos
    if (availableFilters?.categorical) {
      availableFilters.categorical.forEach(filter => {
        const selectedValues = categoricalSelections[filter.field] || [];
        const wasApplied = activeFilters[filter.field]?.in;
        const allAvailableSelected = selectedValues.length === filter.values.length;
        
        // Sempre envia o filtro se:
        // 1. Há valores selecionados (mesmo que todos)
        // 2. OU o filtro estava aplicado anteriormente
        if (selectedValues.length > 0) {
          // Se estava aplicado antes OU não são todos selecionados, envia
          if (wasApplied || !allAvailableSelected) {
            params[`${filter.field}__in`] = selectedValues.join(',');
          }
        } else if (selectedValues.length === 0) {
          // Nenhum selecionado - enviar vazio para não trazer nada
          params[`${filter.field}__in`] = '';
        }
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
