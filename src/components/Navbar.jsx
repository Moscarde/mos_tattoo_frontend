import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img 
            src={require('../assets/logo.png')} 
            alt="Mos Tattoo Logo" 
            className="navbar-logo" 
          />
        </Link>
      </div>
      
      <div className="navbar-right">
        {authenticated ? (
          <>
            {user && <span className="navbar-user">Olá, {user.name || user.username}</span>}
            <button onClick={handleLogout} className="btn btn-logout">
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Área do Usuário
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
