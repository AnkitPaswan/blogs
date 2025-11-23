import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchPosts, fetchCategories } from "../services/api";
import { User, MessageCircle, Heart, Repeat2, Search } from "lucide-react";

export default function AllPosts() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryFromURL = params.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, categoryFromURL]);

  useEffect(() => {
    setSelectedCategory(categoryFromURL);
  }, [categoryFromURL]);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.log(err);
        
        setCategories(["All", "TECHNOLOGY", "ENTERTAINMENT", "SPORTS"]);
      }
    };
    loadCategories();
  }, []);

  // Fetch posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await fetchPosts(selectedCategory);
        setPosts(fetchedPosts);
      } catch (err) {
        console.log(err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [selectedCategory]);

  return (
    <div className="bg-gray-50 pt-10 pb-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {selectedCategory === "All"
              ? "All Trending Posts"
              : `All ${selectedCategory} Posts`}
          </h2>
          <Link
            to="/"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="text-gray-500 text-sm mb-4">
          Showing latest posts for <span className="font-medium">{selectedCategory}</span>
        </p>
        {/* Category Selector */}
        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full sm:w-auto px-4 py-2 border rounded-lg bg-white text-gray-700 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          
          <div className="bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {posts.length ? (
              posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="
                    bg-white border border-gray-200 shadow-sm 
                    hover:shadow-lg transition 
                    rounded-md p-4 flex flex-col
                    h-[430px] sm:h-[420px]
                  "
                >
                  {/* User */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{post.user}</p>
                      <p className="text-xs text-gray-500">{post.handle}</p>
                    </div>
                  </div>

                  {/* Text */}
                  <p className="text-sm text-gray-800 mb-2 line-clamp-3 min-h-[50px]">
                    {post.text}
                  </p>

                  {/* Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      className="w-full h-36 object-cover rounded-md mb-3"
                      alt=""
                    />
                  )}

                  {/* Bottom Fixed Section */}
                  <div className="mt-auto">
                    {/* Stats */}
                    <div className="flex items-center text-gray-500 text-[11px] py-3 border-b border-gray-200">
                      <span className="flex items-center mr-4">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </span>
                      <span className="flex items-center mr-4">
                        <Repeat2 className="w-4 h-4 mr-1" />
                        {post.retweets}
                      </span>
                      <span className="flex items-center mr-4">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </span>

                      <span className="ml-auto text-gray-400 text-[12px]">
                        {post.date}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex justify-between items-center pt-2 text-[11px]">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-gray-500">{post.tag}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No posts found.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
