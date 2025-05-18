import React from 'react';
import CommentItem from './CommentItem'; 
function CommentsSection({ comments }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Ostatnie Dyskusje</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        {comments.map((comment, index) => (
          <CommentItem
            key={comment.id || index} 
            author={comment.author}
            postLink={comment.postLink}
            postTitle={comment.postTitle}
            text={comment.text}
            time={comment.time}
            likes={comment.likes}
            isLast={index === comments.length - 1} 
          />
        ))}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition font-medium">
            Zobacz więcej
          </button>
        </div>
      </div>
    </section>
  );
}

// Domyślne propsy na wypadek, gdyby komentarze nie zostały dostarczone
CommentsSection.defaultProps = {
  comments: []
};

export default CommentsSection;