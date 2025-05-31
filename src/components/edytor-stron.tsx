import React, { useState, useEffect } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'; //

interface EdytorStronProps {
  content?: object;        // For editing existing content
  existingTitle?: string;  // For editing existing content
  existingSlug?: string;   // For editing existing content
  isEditing?: boolean;     // To differentiate between add and edit mode
}

const EdytorStron = ({ content, existingTitle, existingSlug, isEditing = false }: EdytorStronProps) => {
  const [titleInput, setTitleInput] = useState<string>(existingTitle || '');
  const [slugInput, setSlugInput] = useState<string>(existingSlug || '');

  useEffect(() => {
    if (existingTitle) setTitleInput(existingTitle);
    if (existingSlug) setSlugInput(existingSlug);
  }, [existingTitle, existingSlug]);


  const handleSubmit = async (editorData: { content: object }) => {
    // Basic validation for title and slug
    if (!titleInput.trim()) {
      alert('Tytuł strony jest wymagany.');
      return;
    }
    if (!slugInput.trim() && !isEditing) { // Slug is required for new pages
      alert('Adres strony (slug) jest wymagany.');
      return;
    }
    
    const formData = {
      content: editorData.content,
      titleInput,
      slugInput: slugInput.trim().replace(/^\/+|\/+$/g, ''), // Trim and remove leading/trailing slashes
      ...(isEditing && { originalSlug: existingSlug }) // Include originalSlug if editing for backend lookup
    };

    const apiUrl = isEditing ? '/api/edytor/edit-page' : '/api/edytor/add-page'; //

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Strona zapisana pomyślnie! Dostępna pod adresem: /${result.slug || slugInput}`);
        // Optionally redirect or clear form
        if (!isEditing) {
          setTitleInput('');
          setSlugInput('');
          // Potentially reset SimpleEditor content here if needed, though SimpleEditor might need its own reset prop/method
        }
      } else {
        alert(`Błąd: ${result.message || 'Nie udało się zapisać strony.'}`);
      }
    } catch (error) {
      alert(`Błąd połączenia lub serwera: ${(error as Error).message}`);
    }
  };

  return (
    // Removed outer div and form onSubmit, as SimpleEditor has its own submit button and form context
    <div className="space-y-6"> {/* Added Tailwind for spacing */}
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
                {'/'}
            </span>
            <input
                id="slugInput"
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                placeholder="adres-strony (np. moje-odkrycie)"
                required={!isEditing} // Slug is required for new pages
                disabled={isEditing} // Slug typically should not be changed easily after creation
                className="block w-full flex-1 text-sm border-gray-300 rounded-none rounded-r-md focus:ring-red-500 focus:border-red-500 p-2.5"
            />
        </div>
        <p className="mt-1 text-xs text-gray-500">Używaj małych liter, cyfr i myślników. Np. 'historia-regionu-x'</p>
      </div>
      
      {/* SimpleEditor handles its own form submission logic via its internal button */}
      <SimpleEditor onSubmit={handleSubmit} existingContent={content} />
    </div>
  );
};

export default EdytorStron;