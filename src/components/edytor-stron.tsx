// src/components/edytor-stron.tsx
import React, { useState, useEffect } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { allSiteLocations } from '../pages/regiony.astro'; 
import { allOrganizationCategories } from '../lib/organizations';

// Definicja typów, aby zapewnić spójność
interface SiteLocation {
  name: string;
  slug: string;
  description?: string;
  iconClass: string;
}

interface OrganizationCategory {
    name: string;
    slug: string;
    wikipediaLink: string;
}

interface EdytorStronProps {
  content?: object;
  existingTitle?: string;  
  existingSlug?: string;   
  existingRegionSlug?: string | null;
  existingOrgSlug?: string | null;
  isEditing?: boolean;     
}

// Opcje dla list rozwijanych
const inneRegionOption: SiteLocation = { name: "Inne / Bez regionu", slug: "", iconClass: "fas fa-globe", description: "" };
const regionOptions: SiteLocation[] = [inneRegionOption, ...allSiteLocations];

const noOrgOption: OrganizationCategory = { name: "Brak / Nie dotyczy", slug: "", wikipediaLink: "" };
const orgOptions: OrganizationCategory[] = [noOrgOption, ...allOrganizationCategories];

const EdytorStron = ({ 
  content: existingContentFromAstro,
  existingTitle, 
  existingSlug, 
  existingRegionSlug,
  existingOrgSlug,
  isEditing = false 
}: EdytorStronProps) => {
  const [titleInput, setTitleInput] = useState<string>(existingTitle || '');
  const [slugInput, setSlugInput] = useState<string>(existingSlug || '');
  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string>(
    existingRegionSlug === null || existingRegionSlug === undefined ? "" : existingRegionSlug
  );
  const [selectedOrgSlug, setSelectedOrgSlug] = useState<string>(
    existingOrgSlug === null || existingOrgSlug === undefined ? "" : existingOrgSlug
  );

  useEffect(() => {
    if (existingTitle) setTitleInput(existingTitle);
    if (existingSlug) setSlugInput(existingSlug);
    if (existingRegionSlug !== undefined) {
      setSelectedRegionSlug(existingRegionSlug === null ? "" : existingRegionSlug);
    }
    if (existingOrgSlug !== undefined) {
        setSelectedOrgSlug(existingOrgSlug === null ? "" : existingOrgSlug);
    }
  }, [existingTitle, existingSlug, existingRegionSlug, existingOrgSlug]);


  const handleSubmit = async (editorData: { content: object }) => {
    if (!titleInput.trim()) {
      alert('Tytuł strony jest wymagany.');
      return;
    }
    if (!isEditing && !slugInput.trim()) { 
      alert('Adres strony (slug) jest wymagany.');
      return;
    }
    
    const formData = {
      content: editorData.content,
      titleInput: titleInput.trim(),
      slugInput: slugInput.trim().replace(/^\/+|\/+$/g, ''),
      regionSlug: selectedRegionSlug === "" ? null : selectedRegionSlug,
      organizationSlug: selectedOrgSlug === "" ? null : selectedOrgSlug,
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
          window.location.href = '/edytor/listastron'; 
        } else {
          setTitleInput('');
          setSlugInput('');
          setSelectedRegionSlug("");
          setSelectedOrgSlug("");
          // window.location.href = '/edytor/listastron'; // Opcjonalnie można przekierować również po dodaniu nowej strony
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
                {typeof window !== 'undefined' ? `${window.location.origin}/` : '/'}
            </span>
            <input
                id="slugInput"
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-/_]/g, ''))}
                placeholder="adres-strony (np. moje-odkrycie)"
                required={!isEditing}
                disabled={isEditing}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="regionSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Przypisz do regionu:
          </label>
          <select
            id="regionSelect"
            name="regionSlug"
            value={selectedRegionSlug}
            onChange={(e) => setSelectedRegionSlug(e.target.value)}
            className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2.5 bg-white"
          >
            {regionOptions.map(region => (
              <option key={`region-${region.slug}`} value={region.slug}>
                {region.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Wybierz region, do którego należy publikacja.</p>
        </div>
        
        <div>
          <label htmlFor="orgSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Przypisz do organizacji:
          </label>
          <select
            id="orgSelect"
            name="organizationSlug"
            value={selectedOrgSlug}
            onChange={(e) => setSelectedOrgSlug(e.target.value)}
            className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2.5 bg-white"
          >
            {orgOptions.map(org => (
              <option key={`org-${org.slug}`} value={org.slug}>
                {org.name}
              </option>
            ))}
          </select>
           <p className="mt-1 text-xs text-gray-500">Wybierz organizację, jeśli dotyczy.</p>
        </div>
      </div>
      
      <SimpleEditor 
        onSubmit={handleSubmit} 
        existingContent={existingContentFromAstro}
      />
    </div>
  );
};

export default EdytorStron;