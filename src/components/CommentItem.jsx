import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CommentItem({ author, postLink, postTitle, text, time, likes: initialLikes, isLast }) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(initialLikes);

  const handleLike = () => {
    if (isLiked) {
      setCurrentLikes(currentLikes - 1);
    } else {
      setCurrentLikes(currentLikes + 1);
    }
    setIsLiked(!isLiked);
    console.log(`Komentarz użytkownika ${author} do "${postTitle}" ${!isLiked ? 'polubiony' : 'odlubiony'}. Nowa liczba polubień: ${!isLiked ? currentLikes + 1 : currentLikes -1}`);
  };

  return (
    <div className={`comment-box pl-4 ${isLast ? '' : 'mb-6'}`}>
      <div className="flex items-start mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
          <FontAwesomeIcon icon={['fas', 'user']} className="text-gray-600" />
        </div>
        <div className="flex-grow">
          <h4 className="font-medium text-gray-800">{author}</h4>
          <span className="text-xs text-gray-500">
            Skomentował/a <a href={postLink} className="text-red-600 hover:underline">{postTitle}</a>
          </span>
        </div>
      </div>
      <p className="text-gray-700 text-sm md:pl-[52px] pl-0">{text}</p>
      <div className="flex items-center mt-2 md:pl-[52px] pl-0 text-sm">
        <span className="text-gray-500 mr-4 flex items-center">
          <FontAwesomeIcon icon={['far', 'clock']} className="mr-1" /> {time}
        </span>
        <button 
          onClick={handleLike}
          className={`flex items-center bg-transparent transition-colors duration-150 ease-in-out
            ${isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
          aria-pressed={isLiked}
          aria-label={isLiked ? 'Odlub ten komentarz' : 'Polub ten komentarz'}
        >
          <FontAwesomeIcon 
            icon={isLiked ? ['fas', 'heart'] : ['far', 'heart']} 
            className="mr-1" 
          /> 
          {currentLikes}
        </button>
      </div>
    </div>
  );
}

CommentItem.defaultProps = {
  author: 'Anonim',
  postLink: '#',
  postTitle: 'wpis',
  text: 'Brak treści komentarza.',
  time: 'Przed chwilą',
  likes: 0,
  isLast: false,
};

export default CommentItem;
