import React from 'react';
import ContentCard from './ContentCard';

function FeaturedContentSection({ items, navigateTo }) {
  const handleViewAllClick = () => {
    if (navigateTo) {
      navigateTo('Kolekcje'); 
    }
  };
  
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Ostatnio Dodane</h2>
        <button 
          onClick={handleViewAllClick}
          className="text-red-600 hover:underline focus:outline-none"
        >
          Zobacz wszystkie
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ContentCard 
            key={item.id} 
            title={item.title}
            imgSrc={item.imgSrc}
            tag={item.tag}
            age={item.age}
            description={item.description}
            location={item.location}
            commentCount={item.comments}
          />
        ))}
      </div>
    </section>
  );
}

FeaturedContentSection.defaultProps = {
  items: []
};

export default FeaturedContentSection;