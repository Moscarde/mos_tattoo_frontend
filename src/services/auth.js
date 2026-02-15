import api from './api';

const LOGIN_ENDPOINT = process.env.REACT_APP_LOGIN_ENDPOINT || '/api/auth/login/';

/**
 * Realiza o login do usuário
 */
export const login = async (username, password) => {
  try {
    const response = await api.post(LOGIN_ENDPOINT, {
      username,
      password,
    });

    // Django JWT retorna access e refresh tokens
    const { access, refresh, token, user } = response.data;

    // Salvar token de acesso (suporta ambos os formatos)
    const accessToken = access || token;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    }
    
    // Salvar refresh token se disponível
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }
    
    // Salvar dados do usuário se disponíveis
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else if (username) {
      // Se não houver dados do usuário, salvar pelo menos o username
      localStorage.setItem('user', JSON.stringify({ username }));
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro no login:', error);
    
    // Extrair mensagem de erro de várias fontes possíveis
    let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
    
    if (error.response?.data) {
      const data = error.response.data;
      errorMessage = data.detail 
        || data.message 
        || data.error
        || data.non_field_errors?.[0]
        || JSON.stringify(data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Realiza o logout do usuário
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Retorna os dados do usuário atual
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Retorna o token atual
 */
export const getToken = () => {
  return localStorage.getItem('token');
};
