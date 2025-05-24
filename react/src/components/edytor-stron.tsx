import React, { useState } from 'react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';

interface EdytorStronProps {
  autor: string;
  content?: object;
  existingSlug? : string;
}

const EdytorStron = ( {content, existingSlug} : EdytorStronProps) => {
  const [titleInput, setTitleInput] = useState<string>('');
  const [slugInput, setSlugInput] = useState<string>(existingSlug ?? '');
  //const [additionalInput, setAdditionalInput] = useState<string>('');
  const handleSubmit = async (editorData: { content: object }) => {
    const formData = {
      content: editorData.content,
      titleInput,
      slugInput, 
    };

    if (existingSlug == null) {
      try {
        const response = await fetch('/api/edytor/add-page', {
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
    } else {
      try {
        const response = await fetch('/api/edytor/edit-page', {
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
            disabled={!!content}
          />
        </div>
        <SimpleEditor onSubmit={handleSubmit} existingContent={content} />
      </form>
    </div>
  );
};

export default EdytorStron;
