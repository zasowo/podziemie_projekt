import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Logo = ({ onLogoClick }) => (
  <button 
    onClick={onLogoClick} 
    className="group flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded-sm"
    aria-label="Strona główna Patrimonium"
  >
    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-md">
      <FontAwesomeIcon icon={['fas', 'landmark']} className="text-white" />
    </div>
    <h1 className="text-2xl font-bold text-gray-800 transition-colors duration-300 ease-in-out group-hover:text-red-700">
      Podziemie
    </h1>
  </button>
);

export default Logo;