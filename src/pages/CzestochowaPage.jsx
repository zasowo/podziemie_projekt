import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mockCzestochowaItems = [
  { id: 'cz1', title: 'Jasna Góra - Klasztor Paulinów', category: 'Zdjęcie', image: 'https://placehold.co/600x400/D2B48C/000000?text=Jasna+Góra', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'cz2', title: 'Aleja Najświętszej Maryi Panny', category: 'Plakat', image: 'https://placehold.co/600x400/A2B5CD/000000?text=Aleje+NMP', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'cz3', title: 'Muzeum Produkcji Zapałek', category: 'Zdjęcie', image: 'https://placehold.co/600x400/FF8C00/FFFFFF?text=Zapałki', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
  { id: 'cz4', title: 'Ratusz w Częstochowie', category: 'Dokument', image: 'https://placehold.co/600x400/BDB76B/000000?text=Ratusz', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.' },
];

const CzestochowaPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCzestochowaItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        setItems(mockCzestochowaItems);
      } catch (err) {
        setError('Nie udało się pobrać danych dla Częstochowy.');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCzestochowaItems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <FontAwesomeIcon icon={['fas', 'church']} className="text-5xl text-red-700 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Częstochowa</h1>
        <p className="text-lg text-gray-600">Odkryj historyczne i kulturowe skarby.</p>
      </div>
      {isLoading && (
        <div className="text-center py-10">
          <FontAwesomeIcon icon={['fas', 'spinner']} spin size="3x" className="text-red-600" />
        </div>
      )}
      {error && <p className="text-center text-red-500">Błąd: {error}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.length > 0 ? items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
              <img src={item.image} alt={item.title} className="w-full h-56 object-cover" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/CCCCCC/FFFFFF?text=Brak+obrazu"; }} />
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-xs text-red-600 uppercase font-semibold mb-1">{item.category}</p>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{item.description}</p>
                <button className="mt-auto w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition text-sm">
                  Dowiedz się więcej
                </button>
              </div>
            </div>
          )) : (
            <p className="col-span-full text-center text-gray-600">Nie znaleziono żadnych obiektów.</p>
          )}
        </div>
      )}
    </div>
  );
};
export default CzestochowaPage;