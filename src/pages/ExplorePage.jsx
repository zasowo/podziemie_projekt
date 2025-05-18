import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// mock bezsensowne dane
const mockExploreItems = [
  { id: 'e1', title: 'Śląskie', image: 'https://placehold.co/600x400/A9A9A9/FFFFFF?text=Mapa+Świata', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'e2', title: 'Pomorskie', image: 'https://placehold.co/600x400/CD853F/FFFFFF?text=Narzędzia', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'e3', title: 'Mazowieckie', image: 'https://placehold.co/600x400/8A2BE2/FFFFFF?text=Rękopis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'e4', title: 'Małopolskie', image: 'https://placehold.co/600x400/708090/FFFFFF?text=Miasto+XIXw.', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
];

const ExplorePage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchExploreItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // miejsce na api call
        // const response = await fetch('/api/explore-items?filter=all');
        // if (!response.ok) throw new Error('Nie udało się pobrać danych.');
        // const data = await response.json();
        // setItems(data);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Symulacja opóźnienia
        setItems(mockExploreItems);
      } catch (err) {
        setError(err.message);
        setItems([]); // czyści elementy w przypadku błędu
      } finally {
        setIsLoading(false);
      }
    };

    fetchExploreItems();
  }, []); 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Odkrywaj Zasoby Historyczne</h1>
      
      {/* filtrowanie można potem dać
       <div className="mb-8 flex justify-center space-x-4">
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Filtruj</button>
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Sortuj</button>
      </div> */}

      {isLoading && (
        <div className="text-center py-10">
          <FontAwesomeIcon icon={['fas', 'spinner']} spin size="3x" className="text-red-600" />
        </div>
      )}
      {error && <p className="text-center text-red-500">Błąd: {error}</p>}
      
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.length > 0 ? items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/CCCCCC/FFFFFF?text=Brak+obrazu"; }}
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-4 flex-grow">{item.description}</p>
                <button className="mt-auto w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm">
                  Zobacz szczegóły
                </button>
              </div>
            </div>
          )) : (
            <p className="col-span-full text-center text-gray-600">Nie znaleziono żadnych zasobów.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;