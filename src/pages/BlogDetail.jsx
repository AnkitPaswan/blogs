import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { postsAPI } from "../services/api";

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getPost(id);
        setPost(response.data);
        console.log(response);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Post not found');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post details...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Post Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Post Image */}
          {post.image && (
            <div className="relative h-64 md:h-80 lg:h-96">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="p-6 md:p-8">
            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.user}</p>
                <p className="text-sm text-gray-500">{post.handle}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500 ml-auto">
                <Calendar className="w-4 h-4 mr-1" />
                {post.date}
              </div>
            </div>

            {/* Post Text */}
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-gray-800 leading-relaxed text-lg">
                {post.text}
              </p>
            </div>

            {/* Caption */}
            {post.caption && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 italic">{post.caption}</p>
              </div>
            )}

            {/* Tags and Stats */}
            <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {post.tag && (
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{post.tag}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                {/* <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </div> */}
                {/* <div className="flex items-center space-x-1">
                  <Repeat2 className="w-4 h-4" />
                  <span>{post.retweets}</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts Section (Optional) */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">More from {post.category}</h3>
          <p className="text-gray-600">
            Check out more posts in the <span className="font-medium">{post.category}</span> category.
          </p>
          <Link
            to={`/AllPosts?category=${post.category}`}
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All {post.category} Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
