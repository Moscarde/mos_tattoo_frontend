import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" onClick={handleLinkClick}>
          <img 
            src={require('../assets/logo.png')} 
            alt="Mos Tattoo Logo" 
            className="navbar-logo" 
          />
        </Link>
      </div>
      
      <div className="navbar-center">
        {authenticated && user && (
          <span className="navbar-user">Olá, {user.name || user.username}</span>
        )}
      </div>
      
      {/* Menu Desktop */}
      <div className="navbar-right">
        {authenticated ? (
          <>
            <Link to="/app/dashboards" className="btn btn-primary">
              Dashboards
            </Link>
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

      {/* Botão Menu Mobile (Hamburguer) */}
      <button 
        className={`navbar-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu Mobile */}
      <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        {authenticated && user && (
          <span className="navbar-user">Olá, {user.name || user.username}</span>
        )}
        {authenticated ? (
          <>
            <Link 
              to="/app/dashboards" 
              className="btn btn-primary"
              onClick={handleLinkClick}
            >
              Dashboards
            </Link>
            <button onClick={handleLogout} className="btn btn-logout">
              Sair
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="btn btn-primary"
            onClick={handleLinkClick}
          >
            Área do Usuário
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
