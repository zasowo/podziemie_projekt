import React, { useState } from 'react';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CollectionsPage from './pages/CollectionsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CzestochowaPage from './pages/CzestochowaPage';
import ContributeModal from './components/ContributeModal'; 


function App() {
  const [currentPage, setCurrentPage] = useState('Start'); 
  const [currentUserData, setCurrentUserData] = useState(null); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);

  const navigateTo = (page) => {
    console.log("App.js: Nawigacja do strony:", page);
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    console.log("App.js: Użytkownik zalogowany:", userData);
    setCurrentUserData(userData);
    setIsAuthModalOpen(false); 
  };

  const handleLogout = () => {
    console.log("App.js: Użytkownik wylogowany");
    setCurrentUserData(null);
    setIsAuthModalOpen(false); 
    navigateTo('Start'); 
  };

  const openAuthModal = () => {
    if (currentUserData) return; 
    console.log("App.js: Otwieranie AuthModal");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    console.log("App.js: Zamykanie AuthModal");
    setIsAuthModalOpen(false);
  };

  const openContributeModal = () => {
    console.log("App.js: Otwieranie ContributeModal");
    setIsContributeModalOpen(true);
  };

  const closeContributeModal = () => {
    console.log("App.js: Zamykanie ContributeModal");
    setIsContributeModalOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Start': 
        return <HomePage navigateTo={navigateTo} onOpenContributeModal={openContributeModal} />;
      case 'Częstochowa': 
        return <CzestochowaPage />;
      case 'Odkrywaj':
        return <ExplorePage />;
      case 'Kolekcje':
        return <CollectionsPage />;
      case 'Mój profil':
        return currentUserData ? <ProfilePage user={currentUserData} /> : <HomePage navigateTo={navigateTo} onOpenContributeModal={openContributeModal} />; 
      case 'Ustawienia':
        return currentUserData ? <SettingsPage user={currentUserData} /> : <HomePage navigateTo={navigateTo} onOpenContributeModal={openContributeModal} />; 
      default:
        return <HomePage navigateTo={navigateTo} onOpenContributeModal={openContributeModal} />;
    }
  };

  return (
    <div className="bg-gray-50 font-sans flex flex-col min-h-screen">
      <Header 
        navigateTo={navigateTo} 
        currentUser={currentUserData}   
        onLoginSuccess={handleLogin}    
        onLogout={handleLogout}
        isAuthModalOpen={isAuthModalOpen}
        onOpenAuthModal={openAuthModal}
        onCloseAuthModal={closeAuthModal}
      /> 
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      <ContributeModal isOpen={isContributeModalOpen} onClose={closeContributeModal} />
    </div>
  );
}

export default App;