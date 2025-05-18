import React from 'react';

const HeroSection = ({ navigateTo, onOpenContributeModal }) => {
  const handleExploreCollectionsClick = () => {
    if (navigateTo) {
      navigateTo('Kolekcje');
    }
  };

  const handleLearnMoreClick = () => {
    if (onOpenContributeModal) {
      onOpenContributeModal();
    }
  };

  return (
    <section className="bg-gradient-to-r from-red-50 to-white py-16 pt-24 md:pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Chroniąc Nasze Wspólne Dziedzictwo</h2>
          <p className="text-lg text-gray-600 mb-8">
            Odkrywaj, dyskutuj i dokumentuj historyczne artefakty, wydarzenia i miejsca z Polskiego podziemia.
            Dołącz do naszej społeczności entuzjastów historii i konserwatorów.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleExploreCollectionsClick}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
            >
              Przeglądaj Kolekcje
            </button>
            <button 
              onClick={handleLearnMoreClick}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium"
            >
              Dowiedz się Więcej
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;