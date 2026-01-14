import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchPosts, fetchCategories } from "../services/api";
import { MessageCircle, Calendar, EyeIcon } from "lucide-react";
import ShareButton from "../utils/ShareButton";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  // Format: 13 Jan 2026
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

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
    <div className="p-4 md:p-10 rounded-xl bg-gray-50">
      <div className="pr-0 sm:pr-16 md:pr-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {selectedCategory === "All"
              ? "All Trending Posts"
              : `${selectedCategory} Posts`}
          </h2>
          <Link
            to="/"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        <p className="text-gray-500 text-xs sm:text-sm mb-6">
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
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
                  key={post._id}
                  to={`/blog/${post.id}`}
                  className="
                    w-full
                    h-[400px]
                    border rounded-md p-4 
                    bg-white shadow-sm hover:shadow-xl 
                    transition cursor-pointer 
                    border-gray-200 flex flex-col
                  "
                >
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {post.title || post.content?.substring(0, 50) + "..."}
                  </h3>

                  {/* Content */}
                  <p className="text-sm text-gray-600 whitespace-pre-line mb-3 line-clamp-3 flex-grow">
                    {post.content}
                  </p>

                  {/* Image */}
                  {post.image && (
                    <img
                      src={post.image}
                      alt="post"
                      className="w-full h-36 object-cover rounded-lg mb-3 border"
                    />
                  )}

                  {/* Comment, Share Buttons and Date */}
                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                      <Link
                        to={`/blog/${post.id || post._id}`}
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle className="text-gray-500" />
                        <span className="text-sm">{post.commentCount}</span>
                      </Link>
                      <div className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <EyeIcon className="text-gray-500" />
                        <span className="text-sm">{post.views}</span>
                      </div>
                      <ShareButton
                        url={`/blog/${post.id || post._id}`}
                        title={post.title || post.content?.substring(0, 50) + "..."}
                        // showLabel={false}
                        className="text-gray-500 hover:text-blue-600"
                      />
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-10">No posts found.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

