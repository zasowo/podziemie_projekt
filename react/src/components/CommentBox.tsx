import React, { useState } from 'react';

interface CommentBoxProps {
  postId: string
  userId: string | null | undefined;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId, userId }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const isUserValid = Boolean(userId);

  const handleSubmit = async () => {
    if (!comment.trim() || !isUserValid) return;

    setLoading(true);
    try {
      const response = await fetch('/api/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          comment,
        }),
      });
      let result = await response.json()
      if (!response.ok) {
        alert("Wystąpił błąd: " + result.error)
        throw new Error(result.message);
      }
      setComment('');
      setLoading(false);
      window.location.reload()
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
    
  };

  return (
    <div className="p-4 border rounded shadow-sm w-full max-w-md">
      <h4>Dodaj komentarz</h4>
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder={isUserValid ? 'Napisz komentarz...' : 'Zaloguj się aby komentować'}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={!isUserValid || loading}
        rows={4}
      />
      <p>Maks. długość 3000 znaków</p>
      <button
        onClick={handleSubmit}
        disabled={!isUserValid || !comment.trim() || loading}
        className={`px-4 py-2 text-white rounded ${
          isUserValid && comment.trim() && !loading
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Wysyłanie' : 'Wyślij'}
      </button>
    </div>
  );
};

export default CommentBox;
