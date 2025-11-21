import { useState, useEffect } from "react";
import { X, Plus, Edit, Trash2, FileText, Calendar, Heart, MessageCircle, Repeat2, Tag, Image, User, Hash, Save, Search } from "lucide-react";
import { postsAPI } from "../../services/api";
import { categoryAPI } from "../../services/categoryAPI";

export default function ManagePosts({ posts, setPosts }) {
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    user: "",
    handle: "",
    text: "",
    caption: "",
    category: "",
    tag: "",
    date: "",
    likes: 0,
    comments: 0,
    retweets: 0,
    image: "",
  });
  const [editPostId, setEditPostId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  // const [newCategory, setNewCategory] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
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
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Add or Update Post
  const handleAddOrEditPost = async (e) => {
    e.preventDefault();
    if (!newPost.text || !newPost.category) {
      alert("Please fill post text and select category");
      return;
    }

    try {
      if (editPostId) {
        await postsAPI.updatePost(editPostId, newPost);
        setPosts(posts.map(p => p.id === editPostId ? { ...p, ...newPost } : p));
        setEditPostId(null);
      } else {
        const response = await postsAPI.createPost(newPost);
        setPosts([...posts, response.data]);
      }

      setShowModal(false);
      setNewPost({
        user: "",
        handle: "",
        text: "",
        caption: "",
        category: "",
        tag: "",
        date: "",
        likes: 0,
        comments: 0,
        retweets: 0,
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
        setPosts(posts.filter(p => p.id !== id));
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
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
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

      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post) => (
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
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{post.user}</p>
                  <p className="text-gray-500 text-xs">{post.handle}</p>
                </div>
              </div>

              {/* Post Text */}
              <p className="text-gray-700 mb-4 line-clamp-3">{post.text}</p>

              {/* Post Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat2 className="w-4 h-4" />
                    <span>{post.retweets}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
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

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first blog post</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Post</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-white/20 relative animate-fadeIn max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {editPostId ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {editPostId ? "Edit Post" : "Create New Post"}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {editPostId ? "Update your blog post details" : "Share your thoughts with the world"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddOrEditPost} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* User & Handle */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Author Information</label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Author name"
                          className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                          value={newPost.user}
                          onChange={(e) => setNewPost({ ...newPost, user: e.target.value })}
                        />
                      </div>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Handle (e.g. @user)"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                          value={newPost.handle}
                          onChange={(e) => setNewPost({ ...newPost, handle: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Post Content</label>
                    </div>
                    <textarea
                      placeholder="Write your post content here..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 min-h-[120px] resize-none"
                      value={newPost.text}
                      onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Post caption (optional)"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                      value={newPost.caption}
                      onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Image className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Featured Image</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Image URL (optional)"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                      value={newPost.image}
                      onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Category & Tag */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Categorization</label>
                    </div>
                    <select
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Tag (optional)"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                      value={newPost.tag}
                      onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
                    />
                  </div>

                  {/* Date & Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Publication Details</label>
                    </div>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50"
                      value={newPost.date}
                      onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                    />

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <label className="text-xs font-medium text-gray-600">Likes</label>
                        </div>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-center"
                          value={newPost.likes}
                          onChange={(e) => setNewPost({ ...newPost, likes: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3 text-blue-500" />
                          <label className="text-xs font-medium text-gray-600">Comments</label>
                        </div>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-center"
                          value={newPost.comments}
                          onChange={(e) => setNewPost({ ...newPost, comments: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <Repeat2 className="w-3 h-3 text-green-500" />
                          <label className="text-xs font-medium text-gray-600">Shares</label>
                        </div>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/50 text-center"
                          value={newPost.retweets}
                          onChange={(e) => setNewPost({ ...newPost, retweets: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editPostId ? "Update Post" : "Create Post"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

