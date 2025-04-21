import React, { useState } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

const EdytorStron = () => {
  const [titleInput, setTitleInput] = useState<string>('');
  const [slugInput, setSlugInput] = useState<string>('');
  //const [additionalInput, setAdditionalInput] = useState<string>('');

  const handleSubmit = async (editorData: { content: object }) => {
    const formData = {
      content: editorData.content,
      titleInput,
      slugInput, 
      // Add other form data here
    };

    try {
      const response = await fetch('/api/add-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Strona zapisana pod adresem /' + result.slug);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert(`Błąd przy zapisie: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="tytul">Tytuł strony: </label>
          <input
            id="titleInput"
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Tytuł"
          />
        </div>
        <div>
          <label htmlFor="slug">Adres strony: </label>
          <input
            id="slugInput"
            type="text"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder="adres/do/strony"
          />
        </div>
        <SimpleEditor onSubmit={handleSubmit} />
      </form>
    </div>
  );
};

export default EdytorStron;
