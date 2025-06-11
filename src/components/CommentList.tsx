// src/components/CommentList.tsx
import React from 'react';


interface CommentForDisplay {
  _id: string;
  userId: string;
  name: string;    
  comment: string; 
  createdAt: Date;
  updatedAt?: Date;
  userRole?: string; 
}

interface CommentListProps {
  comments: CommentForDisplay[] | null; 
  postId: string;
  role: string | null | undefined;
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId, role }) => {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-gray-500 italic">Brak komentarzy do wyświetlenia.</p>;
  }

  const handleDelete = async (commentId: string) => {
    const confirmed = confirm("Czy na pewno chcesz usunąć ten komentarz?");
    if (!confirmed) return;

    try {
      const res = await fetch('/api/admin/delete-comment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: commentId, postId: postId }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || `Błąd przy usuwaniu komentarza: ${res.statusText}`);
      }
      alert('Komentarz został usunięty. Odśwież stronę, aby zobaczyć zmiany.');
      window.location.reload(); 
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Wystąpił błąd przy próbie usunięcia komentarza.');
    }
  };

 return (
    <ul className="space-y-6">
      {comments.map((comment) => ( 
          <li 
            key={comment._id} 
            id={`comment-${comment._id}`} 
            className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200/80 transition-all duration-300"
          >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500 text-sm font-semibold text-white">
                {comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className={`text-sm font-semibold ${comment.userRole === 'admin' ? 'admin-name-glow' : 'text-gray-800'}`}>
                  {comment.name || 'Anonimowy Użytkownik'}
                </p>
                <time dateTime={new Date(comment.createdAt).toISOString()} className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{comment.comment}</p>
            </div>
            {role === 'admin' && (
              <div className="ml-2 shrink-0">
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="p-1 text-xs text-red-500 hover:text-red-700 focus:outline-none"
                  title="Usuń komentarz"
                >
                  <i className="fas fa-trash-alt"></i>
                  <span className="sr-only">Usuń</span>
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;