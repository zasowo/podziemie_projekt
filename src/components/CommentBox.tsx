import React, { useState } from 'react';

interface CommentBoxProps {
  postId: string;
  userId: string | null | undefined;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId, userId }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUserValid = Boolean(userId);
  const charLimit = 3000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!comment.trim() || !isUserValid || loading) return;
    if (comment.trim().length > charLimit) {
        setError(`Komentarz przekracza limit ${charLimit} znaków.`);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, comment: comment.trim() }),
      });
      
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || result.message || 'Nie udało się dodać komentarza.');
        throw new Error(result.message || 'Server error');
      }
      setComment('');
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      if (!error) { 
        setError('Wystąpił błąd podczas wysyłania komentarza.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200 w-full mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">Dodaj komentarz</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          className="block w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 p-3 min-h-[100px]"
          placeholder={isUserValid ? 'Napisz swój komentarz...' : 'Zaloguj się, aby dodać komentarz.'}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (error) setError(null); 
          }}
          disabled={!isUserValid || loading}
          rows={4}
          maxLength={charLimit + 100} 
        />
        <div className="flex justify-between items-center">
          <p className={`text-xs ${comment.length > charLimit ? 'text-red-600' : 'text-gray-500'}`}>
            {comment.length}/{charLimit} znaków
          </p>
          <button
            type="submit"
            disabled={!isUserValid || !comment.trim() || loading || comment.length > charLimit}
            className={`px-5 py-2 text-sm font-medium text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
              ${(isUserValid && comment.trim() && !loading && comment.length <= charLimit)
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            {loading ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Wysyłanie...</>
            ) : 'Wyślij Komentarz'}
          </button>
        </div>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default CommentBox;