import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CategoryCard({ name, imgSrc, description, docCount, imageCount }) {
  return (
    <div className="category-card bg-white rounded-lg shadow-md overflow-hidden transition cursor-pointer hover:translate-y-[-4px] hover:shadow-lg">
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={imgSrc} 
          alt={name || 'Obraz kategorii'} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x267/E0E0E0/B0B0B0?text=Obraz+Niedostępny"; }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">{name}</h3>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-3 text-sm">{description}</p>
        <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
          <span className="flex items-center">
            <FontAwesomeIcon icon={['fas', 'file-alt']} className="mr-1 text-red-500" /> {docCount} dokumentów
          </span>
          <span className="flex items-center">
            <FontAwesomeIcon icon={['fas', 'image']} className="mr-1 text-red-500" /> {imageCount} obrazów
          </span>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;