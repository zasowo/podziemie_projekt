import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 justify-center md:justify-start">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={['fas', 'landmark']} className="text-white text-sm" />
              </div>
              <span className="font-bold text-gray-800">Podziemie</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Chroniąc historię dla przyszłych pokoleń</p>
          </div>
          
          <div className="flex space-x-6 justify-center md:justify-start">
            <a href="#" className="text-gray-600 hover:text-red-600" aria-label="Twitter">
              <FontAwesomeIcon icon={['fab', 'twitter']} />
            </a>
            <a href="#" className="text-gray-600 hover:text-red-600" aria-label="Facebook">
              <FontAwesomeIcon icon={['fab', 'facebook']} />
            </a>
            <a href="#" className="text-gray-600 hover:text-red-600" aria-label="Instagram">
              <FontAwesomeIcon icon={['fab', 'instagram']} />
            </a>
            <a href="#" className="text-gray-600 hover:text-red-600" aria-label="YouTube">
              <FontAwesomeIcon icon={['fab', 'youtube']} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Podziemie. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;