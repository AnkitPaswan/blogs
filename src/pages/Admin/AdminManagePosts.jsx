import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, FileText, Calendar, MessageCircle, Tag, Image, Search, Filter } from "lucide-react";
import { postsAPI, searchPosts } from "../../services/api";
import { categoryAPI } from "../../services/categoryAPI";
import PostsModal from "../../components/Admin/postsModal";

export default function ManagePosts({ posts: initialPosts, setPosts: setParentPosts }) {
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    caption: "",
    category: "",
    tag: "",
    image: "",
  });
  const [editPostId, setEditPostId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter posts when search query or category changes
  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, initialPosts]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      if (Array.isArray(response.data)) {
        setCategories(response.data.map(cat => cat.name));
      } else {
        console.error('Categories data is not an array:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const filterPosts = async () => {
    // If there's a search query, use the search API
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      try {
        const searchResults = await searchPosts(searchQuery);
        // Filter by category if selected
        const filtered = selectedCategory 
          ? searchResults.filter(post => post.category === selectedCategory)
          : searchResults;
        setFilteredPosts(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setFilteredPosts([]);
      } finally {
        setIsSearching(false);
      }
    } else if (selectedCategory) {
      // If no search query but category is selected, filter locally
      const filtered = initialPosts.filter(post => post.category === selectedCategory);
      setFilteredPosts(filtered);
    } else {
      // Show all posts
      setFilteredPosts(initialPosts);
    }
  };

  // Add or Update Post
  const handleAddOrEditPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.category) {
      alert("Please fill post title, post content and select category");
      return;
    }

    try {
      if (editPostId) {
        await postsAPI.updatePost(editPostId, newPost);
        setParentPosts(initialPosts.map(p => p.id === editPostId ? { ...p, ...newPost } : p));
        setEditPostId(null);
      } else {
        const response = await postsAPI.createPost(newPost);
        setParentPosts([...initialPosts, response.data]);
      }

      setShowModal(false);
      setNewPost({
        title: "",
        content: "",
        caption: "",
        category: "",
        tag: "",
        image: "",
      });
    } catch (error) {
      alert('Error saving post: ' + error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsAPI.deletePost(id);
        setParentPosts(initialPosts.filter(p => p.id !== id));
      } catch (error) {
        alert('Error deleting post: ' + error.response?.data?.message || error.message);
      }
    }
  };

  const handleEdit = (post) => {
    setNewPost(post);
    setEditPostId(post.id);
    setShowModal(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  // Determine which posts to display
  const displayPosts = filteredPosts.length > 0 || searchQuery.length >= 2 || selectedCategory ? filteredPosts : initialPosts;

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manage Posts</h2>
              <p className="text-sm text-gray-600">Create, edit, and manage your blog posts</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full sm:w-48"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm w-full sm:w-48 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* New Post Button */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory) && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("")} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      )}

      {/* Posts Grid */}
      {!isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayPosts.map((post) => (
            <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Post Image */}
              {post.image && (
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Post Content */}
              <div className="p-4">

                {/* Post Text */}
                <p className="text-gray-700 mb-4 line-clamp-3">{post.title}</p>

                {/* Post Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date || post.createdAt}</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tag && (
                  <div className="flex items-center space-x-1 mb-4">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {post.tag}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isSearching && displayPosts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchQuery || selectedCategory ? "No matching posts found" : "No posts yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || selectedCategory 
              ? "Try adjusting your search or filter criteria" 
              : "Get started by creating your first blog post"}
          </p>
          {(searchQuery || selectedCategory) ? (
            <button
              onClick={handleClearFilters}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
            >
              <X className="w-5 h-5" />
              <span>Clear Filters</span>
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Post</span>
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <PostsModal
        showModal={showModal}
        setShowModal={setShowModal}
        newPost={newPost}
        setNewPost={setNewPost}
        editPostId={editPostId}
        categories={categories}
        handleAddOrEditPost={handleAddOrEditPost}
      />
    </div>
  );
}

