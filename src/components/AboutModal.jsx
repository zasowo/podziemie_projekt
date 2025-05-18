import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; 



const AboutModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset'; 
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset'; 
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }


  const handleOverlayClick = (e) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef} 
      onClick={handleOverlayClick} 
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out opacity-100" 
      aria-modal="true"
      role="dialog"
      aria-labelledby="about-modal-title"
    >
      <div className="bg-white rounded-lg w-full max-w-xl mx-auto p-6 shadow-xl transform transition-all duration-300 ease-in-out scale-100 modal-enter-active"> 
        <div className="flex justify-between items-center mb-4">
          <h3 id="about-modal-title" className="text-xl font-bold text-gray-800">O Podziemie</h3> 
          <button 
            onClick={onClose} 
            className="text-gray-700 hover:text-red-600 p-1 -m-1" 
            aria-label="Zamknij modal"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>
        <div className="text-gray-700 space-y-3 text-sm max-h-[70vh] overflow-y-auto modal-content-scroll pr-2">
          <p>
            Podziemie to cyfrowa platforma poświęcona eksploracji, dokumentacji i ochronie historycznych artefaktów, miejsc i wydarzeń z Polski.
          </p>
          <p>
            Naszą misją jest wspieranie dynamicznej społeczności entuzjastów historii, badaczy, edukatorów i konserwatorów. Wierzymy, że dzieląc się wiedzą i opowieściami z przeszłości, możemy budować głębsze zrozumienie i docenienie naszego wspólnego dziedzictwa ludzkości.
          </p>
          <p>Dzięki Podziemiu użytkownicy mogą:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Odkrywać i poznawać historyczne przedmioty i miejsca.</li>
            <li>Uczestniczyć w dyskusjach z innymi członkami społeczności.</li>
            <li>Pomagać w katalogowaniu i zachowywaniu cyfrowych zapisów naszej historii.</li>
          </ul>
          <p>
            Platforma ta powstała z pasji do przeszłości i chęci stworzenia miejsca, gdzie dziedzictwo kulturowe może być łatwo dostępne, badane i chronione przez kolejne pokolenia. Stawiamy na współpracę, otwarty dostęp do wiedzy i wykorzystanie nowoczesnych technologii w służbie historii.
          </p>
          <p>
            Zachęcamy do aktywnego udziału, dzielenia się swoimi odkryciami i współtworzenia tej wyjątkowej przestrzeni. Każdy głos i każdy fragment historii ma znaczenie.
          </p>
          <p>
            Dołącz do nas w naszej podróży, aby chronić i celebrować bogatą tkankę ludzkiej historii dla przyszłych pokoleń.
          </p>
        </div>
        <div className="mt-6 text-center">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium" 
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;