import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserMenu = ({ user, onLogout, onNavigateToPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  if (!user) return null; 

  const handleMenuNavigation = (page) => {
    onNavigateToPage(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition text-gray-700"
        aria-label="Menu użytkownika"
        aria-expanded={isMenuOpen}
      >
        <FontAwesomeIcon icon={['fas', 'user-circle']} className="text-xl" />
        <span className="font-medium hidden sm:inline">{user.username}</span>
        <FontAwesomeIcon icon={isMenuOpen ? ['fas', 'chevron-up'] : ['fas', 'chevron-down']} className="text-xs" />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[70] ring-1 ring-black ring-opacity-5">
          <button
            onClick={() => handleMenuNavigation('Mój profil')}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >
            <FontAwesomeIcon icon={['fas', 'user-edit']} className="mr-2" />
            Mój profil
          </button>
          <button
            onClick={() => handleMenuNavigation('Ustawienia')}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >
            <FontAwesomeIcon icon={['fas', 'cog']} className="mr-2" />
            Ustawienia
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsMenuOpen(false); 
            }}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >
            <FontAwesomeIcon icon={['fas', 'sign-out-alt']} className="mr-2" />
            Wyloguj się
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;