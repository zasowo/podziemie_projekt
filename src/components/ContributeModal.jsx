import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContributeModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const siteOwnerEmail = "kontakt@patrimonium.example.com"; // zastąpić prawdziwym adresem email

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

  // generowanie linku mailto dla Gmaila
  const subject = encodeURIComponent("Współpraca z Podziemie");
  const body = encodeURIComponent(
`Dzień dobry,

Chciałbym/Chciałabym przyczynić się do rozwoju Podziemie.

Opis mojego pomysłu/materiału:
[Tutaj opisz swój pomysł lub rodzaj materiałów, które chcesz przesłać]

Proszę o informację, jak mogę przesłać ewentualne pliki.

Z poważaniem,
[Twoje Imię i Nazwisko (opcjonalnie)]`
  );
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${siteOwnerEmail}&su=${subject}&body=${body}`;


  return (
    <div
      ref={modalRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100"
      aria-modal="true"
      role="dialog"
      aria-labelledby="contribute-modal-title"
    >

      <div className="bg-white rounded-lg w-11/12 sm:w-full sm:max-w-xl mx-auto p-6 shadow-xl transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-4">
          <h3 id="contribute-modal-title" className="text-xl font-bold text-gray-800">Jak Możesz Współtworzyć Podziemie?</h3>
          <button 
            onClick={onClose} 
            className="text-gray-700 hover:text-red-600 p-1 -m-1"
            aria-label="Zamknij modal"
          >
            <FontAwesomeIcon icon={['fas', 'times']} className="text-xl" />
          </button>
        </div>
        <div className="text-gray-700 space-y-3 text-sm max-h-[70vh] overflow-y-auto pr-2">
          <p>
            Podziemie to projekt tworzony z pasją przez społeczność dla społeczności. Każdy wkład, duży czy mały, jest dla nas niezwykle cenny i pomaga w budowaniu bogatszego obrazu naszej wspólnej przeszłości.
          </p>
          <h4 className="font-semibold text-gray-800 mt-3">Sposoby współtworzenia:</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Dzielenie się wiedzą:</strong> Posiadasz ciekawe informacje, badania lub historie związane z konkretnymi artefaktami, miejscami czy wydarzeniami? Daj nam znać!</li>
            <li><strong>Materiały wizualne:</strong> Masz historyczne zdjęcia, skany dokumentów, mapy lub rysunki, którymi chciałbyś się podzielić?</li>
            <li><strong>Korekta i uzupełnianie danych:</strong> Zauważyłeś błąd lub posiadasz dodatkowe informacje do istniejących wpisów? Twoja pomoc w weryfikacji jest nieoceniona.</li>
            <li><strong>Propozycje nowych obiektów:</strong> Znasz miejsce lub artefakt, który powinien znaleźć się na naszej platformie?</li>
          </ul>
          <p className="mt-3">
            Twoje zaangażowanie pozwala nam chronić i promować dziedzictwo kulturowe dla przyszłych pokoleń.
          </p>
          <h4 className="font-semibold text-gray-800 mt-4">Skontaktuj się z nami!</h4>
          <p>
            Jeśli chcesz podzielić się swoimi materiałami, pomysłami lub masz jakiekolwiek pytania dotyczące współpracy, skontaktuj się z nami mailowo. W treści wiadomości opisz krótko swój wkład. Jeśli posiadasz pliki (zdjęcia, dokumenty), wspomnij o tym – poinformujemy Cię o najlepszym sposobie ich przesłania.
          </p>
          <div className="mt-4 text-center">
        
            <a
              href={gmailLink}
              target="_blank" // nowa karta
              rel="noopener noreferrer" // tak bezpieczniej
              className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              <FontAwesomeIcon icon={['fas', 'paper-plane']} className="mr-2"/>
              Napisz do nas
            </a>
          </div>
           <p className="text-xs text-gray-500 mt-3 text-center">
            Pamiętaj, aby nie przesyłać dużych załączników bezpośrednio w pierwszej wiadomości bez wcześniejszego uzgodnienia.
          </p>
        </div>
        <div className="mt-6 text-right">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributeModal;