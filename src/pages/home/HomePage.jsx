import React from 'react';
import HeroSection from './sections/HeroSection';
import CustomOrderPromoBanner from './sections/CustomOrderPromoBanner';
import WorldCupStarsSection from './sections/WorldCupStarsSection';
import AboutClubSection from './sections/AboutClubSection';
import ClubLogosSection from './sections/ClubLogosSection';
import CustomerReviewsSection from './sections/CustomerReviewsSection';

/**
 * HomePage: Ensamblador de todas las secciones del Home
 */
export default function HomePage({ onNavigate = () => {} }) {
  const handleSelectStar = (star) => {
    onNavigate('catalogo', star.name);
  };

  return (
    <div className="bg-bg-base min-h-screen text-txt-main transition-colors">
      {/* 1. Hero Principal: Portada de alto impacto */}
      <HeroSection 
        onExplore={() => onNavigate('catalogo')}
        onCustomOrder={() => onNavigate('pedir_a_medida')}
      />

      {/* 2. Banner de Personalización Gratis de Camisetas */}
      <div id="promo-banner">
        <CustomOrderPromoBanner 
          onCustomOrder={() => onNavigate('pedir_a_medida')}
        />
      </div>

      {/* 2.1 Estrellas del Mundial 2026 */}
      <WorldCupStarsSection onSelectPlayer={handleSelectStar} />

      {/* 3. Sección 'About the Club' */}
      <AboutClubSection onExplore={() => onNavigate('catalogo')} />

      {/* 4. Sección 'Clubes Destacados' */}
      <ClubLogosSection onSelectClub={(clubName) => onNavigate('catalogo', clubName)} />

      {/* 5. Sección 'Lo Que Dicen Nuestros Clientes' */}
      <CustomerReviewsSection onProductClick={(productName) => onNavigate('catalogo', productName)} />
    </div>
  );
}
