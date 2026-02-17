import api from './api';

/**
 * Lista todos os dashboards disponíveis para o usuário autenticado
 * @returns {Promise<Object>} Lista paginada de dashboards
 */
export const getDashboards = async () => {
    try {
        const response = await api.get('/api/dashboards/');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Erro ao buscar dashboards:', error);
        const errorMessage = error.response?.data?.detail
            || error.response?.data?.message
            || 'Erro ao carregar dashboards';
        return { success: false, error: errorMessage };
    }
};

/**
 * Busca os dados completos de um dashboard específico
 * @param {string} id - ID do dashboard
 * @param {Object} queryParams - Parâmetros de filtro opcionais (ex: { sold_at__gte: '2024-01-01', seller_id__in: '1,2,3' })
 * @returns {Promise<Object>} Dados completos do dashboard
 */
export const getDashboardData = async (id, queryParams = {}) => {
    try {
        // Construir URL com query parameters
        const params = new URLSearchParams();
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value);
            }
        });
        
        const queryString = params.toString();
        const url = queryString 
            ? `/api/dashboards/${id}/data/?${queryString}`
            : `/api/dashboards/${id}/data/`;
        
        const response = await api.get(url);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        const errorMessage = error.response?.data?.detail
            || error.response?.data?.message
            || 'Erro ao carregar dados do dashboard';
        return { success: false, error: errorMessage };
    }
};
