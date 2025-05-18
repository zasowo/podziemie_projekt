import React, { useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AboutModal from './AboutModal'; 
import AuthModal from './AuthModal';   
import Logo from './Logo'; 
import Navigation from './Navigation';
import UserMenu from './UserMenu'; 

function Header({ 
  navigateTo, 
  currentUser, 
  onLoginSuccess, 
  onLogout,
  isAuthModalOpen,
  onOpenAuthModal,
  onCloseAuthModal 
}) { 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAboutModal = () => {
    setIsAboutModalOpen(true);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const closeAboutModal = () => {
    setIsAboutModalOpen(false);
  };

  const handleNavigation = (page) => {
    console.log("Header.js: Wywołano handleNavigation dla strony:", page); 
    navigateTo(page);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    navigateTo('Start'); 
  };

  return (
    <>
      <header className="bg-white shadow-sm hero-pattern sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Logo onLogoClick={handleLogoClick} /> 
            <div className="hidden md:flex">
               <Navigation 
                  isMobileMenuOpen={false} 
                  onAboutClick={openAboutModal} 
                  onNavigate={handleNavigation} 
                /> 
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <UserMenu 
                  user={currentUser} 
                  onLogout={onLogout} 
                  onNavigateToPage={handleNavigation} 
                />
              ) : (
                <button 
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Zaloguj się
                </button>
              )}
              <button className="md:hidden text-gray-700" onClick={handleMobileMenuToggle} aria-label="Przełącz menu">
                <FontAwesomeIcon icon={isMobileMenuOpen ? ['fas', 'times'] : ['fas', 'bars']} className="text-xl" />
              </button>
            </div>
          </div>
           {isMobileMenuOpen && (
              <div className="md:hidden">
                   <Navigation 
                      isMobileMenuOpen={isMobileMenuOpen} 
                      onAboutClick={openAboutModal} 
                      onNavigate={handleNavigation} 
                    />
              </div>
          )}
        </div>
      </header>
      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
      {!currentUser && ( 
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={onCloseAuthModal} 
          onLoginSuccess={onLoginSuccess} 
        />
      )}
    </>
  );
}

export default Header;