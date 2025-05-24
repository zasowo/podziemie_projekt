import React from 'react';
import type { Comment } from '@/lib/pagedb';

interface CommentListProps {
  comments: Comment[];
  postId: string;
  role: string | null;
}

const CommentList: React.FC<CommentListProps> = ({ comments, postId, role }) => {
    console.log(comments)
  if (!comments || comments.length === 0) {
    return <h3>Komentarze: brak</h3>;
  }

  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch('/api/admin/delete-comment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: commentId , postId : postId}),
      });

      if (!res.ok) {
        throw new Error(`Błąd przy usuwaniu komentarza: ${res.statusText}`);
      }

      alert('Komentarz został usunięty (odśwież stronę, aby zobaczyć zmiany)');
    } catch (err) {
      console.error(err);
      alert('Wystąpił błąd przy próbie usunięcia komentarza.');
    }
  };

  return (
    <>
      <h3>Komentarze ({comments.length})</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id.toString()}>
            <strong>{comment.name}</strong>: {comment.comment}
            {role === 'admin' && (
              <button
                onClick={() => handleDelete(comment._id.toString())}
                style={{ marginLeft: '1em', color: 'red' }}
              >
                Usuń
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CommentList;
