import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// mock dane
const mockCollections = [
  { id: 'c1', name: 'Dokumenty', itemsCount: 150, image: 'https://placehold.co/600x400/FFD700/000000?text=Dokumenty', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'c2', name: 'Plakaty',  itemsCount: 85, image: 'https://placehold.co/600x400/B0E0E6/000000?text=Plakaty', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'c3', name: 'Zdjęcia',  itemsCount: 220, image: 'https://placehold.co/600x400/4682B4/FFFFFF?text=Zdjęcia', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
];

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // zamienić na Api call
        // const response = await fetch('/api/collections');
        // if (!response.ok) throw new Error('Nie udało się pobrać kolekcji.');
        // const data = await response.json();
        // setCollections(data);
        await new Promise(resolve => setTimeout(resolve, 1200)); // symulacja opóźnienia
        setCollections(mockCollections);
      } catch (err) {
        setError(err.message);
        setCollections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Przeglądaj Kolekcje</h1>
      
      {isLoading && (
        <div className="text-center py-10">
          <FontAwesomeIcon icon={['fas', 'spinner']} spin size="3x" className="text-red-600" />
        </div>
      )}
      {error && <p className="text-center text-red-500">Błąd: {error}</p>}

      {!isLoading && !error && (
        <div className="space-y-6">
          {collections.length > 0 ? collections.map(collection => (
            <div key={collection.id} className="bg-white rounded-xl shadow-xl overflow-hidden md:flex transition-all duration-300 hover:shadow-2xl">
              <div className="md:w-1/3">
                <img 
                  src={collection.image} 
                  alt={collection.name} 
                  className="w-full h-56 md:h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/CCCCCC/FFFFFF?text=Brak+obrazu"; }}
                />
              </div>
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{collection.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">Liczba obiektów: <span className="font-medium text-gray-700">{collection.itemsCount}</span></p>
                  <p className="text-gray-600 text-sm mb-4">{collection.description}</p>
                </div>
                <button className="self-start mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition text-sm">
                  Przeglądaj kolekcję
                </button>
              </div>
            </div>
          )) : (
             <p className="text-center text-gray-600 py-10">Nie znaleziono żadnych kolekcji.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;