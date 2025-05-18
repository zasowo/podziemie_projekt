import React from 'react';
import CategoriesSection from '../components/CategoriesSection'; 
import FeaturedContentSection from '../components/FeaturedContentSection'; 
import CommentsSection from '../components/CommentsSection'; 

function MainContent({ navigateTo }) {
  //mock zawartość
  const categoriesData = [
    { id: 'eur', name: "Śląskie", imgSrc: "https://placehold.co/600x400/E0E0E0/B0B0B0?text=Śląskie", description: "Odkryj 1,240 pozycji z Śląskie", docs: 342, images: 898 },
    { id: 'asi', name: "Małopolskie", imgSrc: "https://placehold.co/600x400/D0D0D0/A0A0A0?text=Małopolskie", description: "Poznaj 890 pozycji z Małopolskie", docs: 215, images: 675 },
    { id: 'ame', name: "Pomorskie", imgSrc: "https://placehold.co/600x400/C0C0C0/909090?text=Pomorskie", description: "Zobacz 720 pozycji z Pomorskie", docs: 180, images: 540 },
    { id: 'afr', name: "Łódzkie", imgSrc: "https://placehold.co/600x400/B0B0B0/808080?text=Łódzkie", description: "Zbadaj 430 pozycji z Łódzkie", docs: 95, images: 335 },
  ];

  const featuredItemsData = [
    { id: 1, title: "Kolekcja Propagandy", imgSrc: "https://placehold.co/600x400/E0E0E0/B0B0B0?text=Plakat", tag: "Plakat", age: "2 dni temu", description: "Kolekcja 24 oryginalnych plakatów propagandowych.", location: "Mazowieckie", comments: 14 },
    { id: 2, title: "Zapisy Handlowe", imgSrc: "https://placehold.co/600x400/D0D0D0/A0A0A0?text=Rękopis", tag: "Dokument", age: "1 tydzień temu", description: "Zdigitalizowane zapisy transakcji kupców, odkrywające ukryte szlaki handlowe.", location: "Lubelskie", comments: 8 },
    { id: 3, title: "Fabryki Przemysłowe", imgSrc: "https://placehold.co/600x400/C0C0C0/909090?text=Zdjęcie+Fabryki", tag: "Kolekcja Zdjęć", age: "3 tygodnie temu", description: "Rzadkie fotografie młynów tekstylnych i fabryk, dokumentujące warunki pracy.", location: "Wielkoposkie", comments: 23 },
  ];

  const commentsData = [
    { id: 'c1', author: "HistorykBadacz", postLink: "#", postTitle: "Kolekcja Propagandy", text: "Ten francuski plakat pokazuje interesującą zmianę w przekazie w porównaniu do wcześniejszych przykładów. Paleta kolorów sugeruje, że został wydrukowany w okresie niedoborów papieru.", time: "2 godziny temu", likes: 5 },
    { id: 'c2', author: "OdkrywcaArchiwów", postLink: "#", postTitle: "Zapisy Handlowe", text: "Wpis wspomina o handlu \"przyprawami z Orientu\" za wełnę. To pasuje do zapisów, które widziałem w archiwach - fascynujące zobaczyć tę samą transakcję z tej perspektywy.", time: "1 dzień temu", likes: 3 },
    { id: 'c3', author: "HistorykPrzemysłu", postLink: "#", postTitle: "Fabryki Przemysłowe", text: "Zdjęcie nr 7 pokazuje dziecięcych robotników obsługujących maszyny. Brak osłon bezpieczeństwa był typowy dla tego okresu, ale zauważcie, jak brygadzista w tle jest jedyną osobą noszącą buty - wyraźne przypomnienie hierarchii społecznej.", time: "3 dni temu", likes: 12 },
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      <CategoriesSection categories={categoriesData} navigateTo={navigateTo} />
      <FeaturedContentSection items={featuredItemsData} navigateTo={navigateTo} />
      <CommentsSection comments={commentsData} />
    </main>
  );
}

export default MainContent;