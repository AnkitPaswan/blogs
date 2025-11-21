import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Carousel = ({ posts, category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  if (posts.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{category} Posts</h3>
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.id} className="w-full flex-shrink-0 p-4">
              <div className="border rounded-lg p-4 bg-white shadow-md">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{post.user}</p>
                    <p className="text-xs text-gray-500">{post.handle}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 mb-2">{post.text}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="rounded-md mb-2 border w-full h-36 object-cover"
                  />
                )}
                <div className="flex items-center space-x-4 text-gray-500 text-xs mt-auto">
                  <span>💬 {post.comments}</span>
                  <span>🔁 {post.retweets}</span>
                  <span>❤️ {post.likes}</span>
                  <span className="ml-auto">{post.date}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{post.tag}</span>
                  <Link to={`/all-posts?category=${post.category}`} className="text-blue-600 hover:underline">
                    View All {post.category}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-50 hover:opacity-100"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Carousel;
