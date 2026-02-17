import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/Mos_Tattoo_Legacy_page-0001.jpg';
import historyImage from '../assets/Mos_Tattoo_Legacy_page-0002.jpg';
import productsImage from '../assets/Mos_Tattoo_Legacy_page-0003.jpg';
import expansionImage from '../assets/Mos_Tattoo_Legacy_page-0004.jpg';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1 className="home-main-title">Mos Tattoo Supply</h1>
            <p className="home-subtitle">Tradição, Resiliência e Precisão desde 1998</p>
          </div>
          <div className="home-hero-image">
            <img src={logoImage} alt="Mos Tattoo Supply Legacy" />
          </div>
        </div>
      </section>

      {/* História Section */}
      <section className="home-story-section">
        <div className="home-content-wrapper">
          <div className="home-text-content">
            <h2 className="home-section-title">Nossa História</h2>
            <p className="home-section-text">
              Em 1998, no coração vibrante do <strong>Rio de Janeiro</strong>, nascia a Mos Tattoo Supply. 
              O que começou como um pequeno balcão de suprimentos para tatuadores locais rapidamente 
              se transformou em um pilar da indústria de tatuagem brasileira.
            </p>
            <p className="home-section-text">
              A paixão pela arte na pele e o compromisso em fornecer materiais de alta qualidade 
              impulsionaram nossos fundadores a expandir e inovar constantemente.
            </p>
          </div>
          <div className="home-image-content">
            <img src={historyImage} alt="História da Mos Tattoo" />
          </div>
        </div>
      </section>

      {/* Produtos Section */}
      <section className="home-products-section">
        <div className="home-content-wrapper reverse">
          <div className="home-image-content">
            <img src={productsImage} alt="Produtos Mos Tattoo" />
          </div>
          <div className="home-text-content">
            <h2 className="home-section-title">Excelência em Produtos</h2>
            <p className="home-section-text">
              Tornamo-nos referência na <strong>fabricação de máquinas de tatuagem robustas e precisas</strong>, 
              agulhas esterilizadas de ponta e fontes de energia confiáveis.
            </p>
            <p className="home-section-text">
              Nossa gama de tintas, com uma paleta de cores tão vasta quanto a criatividade de um tatuador, 
              tornou-se um dos nossos maiores orgulhos.
            </p>
          </div>
        </div>
      </section>

      {/* Expansão Section */}
      <section className="home-expansion-section">
        <div className="home-content-wrapper">
          <div className="home-text-content">
            <h2 className="home-section-title">Expansão Nacional</h2>
            <p className="home-section-text">
              A marca expandiu sua presença para além das fronteiras cariocas, estabelecendo 
              <strong> lojas físicas em mais de 5 estados brasileiros</strong>.
            </p>
            <p className="home-section-text">
              Abraçamos o mundo digital, criando uma plataforma online que permite a tatuadores 
              de todo o país e até mesmo do exterior acessarem nossos produtos de forma rápida e eficiente.
            </p>
            <div className="home-highlight-box">
              <p>Hoje, a Mos Tattoo Supply é sinônimo de <strong>excelência e inovação</strong>, 
              uma marca que cresceu com a cultura da tatuagem no Brasil e continua a impulsionar 
              a arte com seus produtos de qualidade.</p>
            </div>
          </div>
          <div className="home-image-content">
            <img src={expansionImage} alt="Expansão Mos Tattoo" />
          </div>
        </div>
      </section>

      {/* CTA Section - Internal Access */}
      <section className="home-cta-section">
        <div className="home-cta-content">
          <p className="home-internal-label">Área Restrita</p>
          <h3 className="home-cta-title-small">Acesso para Gerentes e Gestores</h3>
          <p className="home-cta-text-small">
            Sistema interno de dashboards e análise de dados operacionais.
          </p>
          <Link to="/login" className="btn btn-secondary-light btn-medium">
            Login Interno
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
