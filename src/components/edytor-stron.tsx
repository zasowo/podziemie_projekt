// src/components/edytor-stron.tsx
import React, { useState, useEffect } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
// Zaimportuj listę lokalizacji i ich typ z regiony.astro
// Upewnij się, że plik regiony.astro eksportuje 'allSiteLocations'
// oraz że ten import jest poprawny dla struktury Twojego projektu.
import { allSiteLocations } from '../pages/regiony.astro'; 

// Definicja typu dla pojedynczej lokalizacji, jeśli nie jest eksportowany z regiony.astro
// Powinna być spójna z tym, co eksportuje regiony.astro
interface SiteLocation {
  name: string;
  slug: string;
  description?: string;
  iconClass: string;
}

interface EdytorStronProps {
  content?: object;             // Przekazywane jako existingContent z .astro
  existingTitle?: string;
  existingSlug?: string;
  existingRegionSlug?: string | null;
  isEditing?: boolean;
}

// Opcja "Inne" do wyboru regionu
const inneRegionOption = { name: "Inne / Bez regionu", slug: "", iconClass: "fas fa-question-circle" }; // Dodano iconClass dla spójności typu
const regionOptions: SiteLocation[] = [inneRegionOption, ...allSiteLocations];

const EdytorStron = ({ 
  content: existingContentFromAstro, // Zmieniamy nazwę propa dla jasności
  existingTitle, 
  existingSlug, 
  existingRegionSlug,
  isEditing = false 
}: EdytorStronProps) => {
  const [titleInput, setTitleInput] = useState<string>(existingTitle || '');
  const [slugInput, setSlugInput] = useState<string>(existingSlug || '');
  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string>(
    existingRegionSlug === null || existingRegionSlug === undefined ? "" : existingRegionSlug
  );

  useEffect(() => {
    if (existingTitle) setTitleInput(existingTitle);
    if (existingSlug) setSlugInput(existingSlug);
    if (existingRegionSlug !== undefined) {
      setSelectedRegionSlug(existingRegionSlug === null ? "" : existingRegionSlug);
    }
  }, [existingTitle, existingSlug, existingRegionSlug]);


  const handleSubmit = async (editorData: { content: object }) => {
    if (!titleInput.trim()) {
      alert('Tytuł strony jest wymagany.');
      return;
    }
    // Slug jest wymagany tylko przy tworzeniu nowej strony, jeśli nie jest w trybie edycji
    if (!isEditing && !slugInput.trim()) { 
      alert('Adres strony (slug) jest wymagany.');
      return;
    }
    
    const formData = {
      content: editorData.content,
      titleInput: titleInput.trim(),
      slugInput: slugInput.trim().replace(/^\/+|\/+$/g, ''), // Używany do znalezienia strony przy edycji lub jako nowy slug
      regionSlug: selectedRegionSlug === "" ? null : selectedRegionSlug, 
    };

    const apiUrl = isEditing ? '/api/edytor/edit-page' : '/api/edytor/add-page';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Strona "${formData.titleInput}" zapisana pomyślnie!`);
        if (isEditing) {
          // Przekierowanie do listy stron po udanej edycji
          window.location.href = '/edytor/listastron'; 
        } else {
          // Po dodaniu nowej strony, można również przekierować lub wyczyścić formularz
          setTitleInput('');
          setSlugInput('');
          setSelectedRegionSlug(""); 
          // Aby zresetować SimpleEditor, musiałby on przyjąć key prop lub mieć metodę reset
          // window.location.href = '/edytor/listastron'; // Opcjonalnie
        }
      } else {
        alert(`Błąd: ${result.message || 'Nie udało się zapisać strony.'}`);
      }
    } catch (error) {
      alert(`Błąd połączenia lub serwera: ${(error as Error).message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="titleInput" className="block text-sm font-medium text-gray-700 mb-1">
          Tytuł strony:
        </label>
        <input
          id="titleInput"
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Wpisz tytuł strony..."
          required
          className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2.5"
        />
      </div>
      <div>
        <label htmlFor="slugInput" className="block text-sm font-medium text-gray-700 mb-1">
          Adres strony (slug):
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {/* Astro.url nie jest dostępne w komponentach React client:only. Używamy window.location.origin. */}
                {typeof window !== 'undefined' ? `${window.location.origin}/` : '/'}
            </span>
            <input
                id="slugInput"
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-/_]/g, ''))}
                placeholder="adres-strony (np. moje-odkrycie)"
                required={!isEditing} // Wymagane tylko przy tworzeniu nowej strony
                disabled={isEditing}  // Zablokowane podczas edycji
                className="block w-full flex-1 text-sm border-gray-300 rounded-none rounded-r-md focus:ring-red-500 focus:border-red-500 p-2.5"
            />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {isEditing 
            ? "Adres strony (slug) nie może być zmieniony po publikacji." 
            : "Używaj małych liter, cyfr, myślników i ukośników (/). Np. 'historia/regionu/x'"
          }
        </p>
      </div>
      
      <div>
        <label htmlFor="regionSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Przypisz do regionu:
        </label>
        <select
          id="regionSelect"
          name="regionSlug" // Dodano atrybut name dla spójności
          value={selectedRegionSlug}
          onChange={(e) => setSelectedRegionSlug(e.target.value)}
          className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2.5 bg-white"
        >
          {regionOptions.map(region => (
            <option key={region.slug} value={region.slug}>
              {region.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">Wybierz region, do którego należy publikacja, lub "Inne", jeśli nie dotyczy konkretnego regionu.</p>
      </div>
      
      <SimpleEditor 
        onSubmit={handleSubmit} 
        existingContent={existingContentFromAstro} // Przekaż content z Astro
      />
    </div>
  );
};

export default EdytorStron;