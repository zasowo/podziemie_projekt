import React from 'react';
import CategoryCard from './CategoryCard'; 

function CategoriesSection({ categories, navigateTo }) {
  const handleViewAllClick = () => {
    if (navigateTo) {
      navigateTo('Odkrywaj');
    }
  };

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Przeglądaj według Lokalizacji</h2>
        <button 
          onClick={handleViewAllClick}
          className="text-red-600 hover:underline focus:outline-none"
        >
          Zobacz wszystkie
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard 
            key={category.id} 
            name={category.name}
            imgSrc={category.imgSrc}
            description={category.description}
            docCount={category.docs}
            imageCount={category.images}
          />
        ))}
      </div>
    </section>
  );
}

CategoriesSection.defaultProps = {
  categories: [] 
};

export default CategoriesSection;