import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../services/auth';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/app/dashboards', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setLoading(true);

    console.log('handleSubmit chamado');

    // Validação básica
    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return false;
    }

    try {
      // Realizar login
      console.log('Tentando fazer login...');
      const result = await login(formData.username, formData.password);

      console.log('Resultado do login:', result);

      if (result.success) {
        // Redirecionar para hub de dashboards
        console.log('Login bem-sucedido, redirecionando...');
        navigate('/app/dashboards');
      } else {
        console.error('Erro no login:', result.error);
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error('Exceção no handleSubmit:', err);
      setError('Erro inesperado. Tente novamente.');
      setLoading(false);
    }
    
    return false;
  };

  return (
    <div className="container-small login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary form-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
