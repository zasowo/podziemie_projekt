import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 

function ContentCard({ title, imgSrc, tag, age, description, location, commentCount }) {
  return (
    <div className="content-card bg-white rounded-lg shadow-md overflow-hidden transition hover:translate-y-[-2px] flex flex-col">
      <div className="h-48 bg-gray-200 relative">
        <img 
          src={imgSrc} 
          alt={title || 'Obraz treści'} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/E0E0E0/B0B0B0?text=Obraz+Niedostępny"; }} 
        />
        {tag && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            {tag}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 flex-grow pr-2">{title}</h3>
          <span className="text-xs text-gray-500 flex-shrink-0">{age}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        <div className="flex justify-between items-center text-sm mt-auto">
          <span className="text-gray-500 flex items-center">
            <FontAwesomeIcon icon={['fas', 'map-marker-alt']} className="mr-1 text-red-600" /> {location}
          </span>
          <span className="text-gray-500 flex items-center">
            <FontAwesomeIcon icon={['fas', 'comment']} className="mr-1 text-red-600" /> {commentCount} komentarzy
          </span>
        </div>
      </div>
    </div>
  );
}

export default ContentCard;
