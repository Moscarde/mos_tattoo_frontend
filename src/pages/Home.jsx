import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="home-hero">
        <h1 className="home-title">
          Bem-vindo ao Mos Tattoo
        </h1>
        
        <div className="home-emoji">
          <span>🖋️</span>
          <span>💉</span>
          <span>🧠</span>
          <span>🎨</span>
          <span>🖤</span>
        </div>

        <div className="home-description">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <br />
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt 
            in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <br />
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>

        <div className="home-cta">
          <Link to="/login" className="btn btn-primary">
            Acessar Sistema
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
