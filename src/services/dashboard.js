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
 * @returns {Promise<Object>} Dados completos do dashboard
 */
export const getDashboardData = async (id) => {
  try {
    const response = await api.get(`/api/dashboards/${id}/data/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    const errorMessage = error.response?.data?.detail 
      || error.response?.data?.message 
      || 'Erro ao carregar dados do dashboard';
    return { success: false, error: errorMessage };
  }
};
