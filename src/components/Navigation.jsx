import React from 'react';

const Navigation = ({ isMobileMenuOpen, onAboutClick, onNavigate }) => {
  const handleNavClick = (pageName) => {
    if (onNavigate) { 
      console.log("Navigation.jsx: Kliknięto:", pageName); 
      onNavigate(pageName);
    } else {
      console.error("Navigation.jsx: Funkcja onNavigate nie została przekazana!");
    }
  };

  return (
    <nav 
      className={`
        ${isMobileMenuOpen ? 'block absolute top-16 left-0 right-0 bg-white shadow-md py-4 z-50' : 'hidden'} 
        md:flex md:space-x-8 md:static md:shadow-none md:py-0 md:bg-transparent
      `}
    >
      <div className={`
        ${isMobileMenuOpen ? 'flex flex-col items-center space-y-4' : 'flex space-x-8'}
      `}>
        <button 
          onClick={() => handleNavClick('Częstochowa')} 
          className="nav-link text-red-700 hover:text-red-500 font-semibold px-2 py-1 border-b-2 border-transparent hover:border-red-700 transition-colors duration-200"
        >
          Częstochowa
        </button>
        <button 
          onClick={() => handleNavClick('Odkrywaj')} 
          className="nav-link text-gray-700 hover:text-red-600 font-medium px-2 py-1"
        >
          Odkrywaj
        </button>
        <button 
          onClick={() => handleNavClick('Kolekcje')} 
          className="nav-link text-gray-700 hover:text-red-600 font-medium px-2 py-1"
        >
          Kolekcje
        </button>
        <button 
          onClick={onAboutClick} 
          className="nav-link text-gray-700 hover:text-red-600 font-medium px-2 py-1 text-left"
        >
          O nas
        </button>
      </div>
    </nav>
  );
};

export default Navigation;