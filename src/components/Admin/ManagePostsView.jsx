import {
  X,
  Plus,
  Edit,
  Trash2,
  FileText,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import PostsModal from "../../components/Admin/PostsModal";
import { formatDate } from "../../utils/formatDate";
import notFoundImage from "/assets/notfound.webp";
import { SkeletonLoaderForPosts } from "../../utils/SkeletonLoader";

export default function ManagePostsView({
  showModal,
  setShowModal,
  newPost,
  setNewPost,
  editPostId,
  setEditPostId,
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  posts,
  handleEdit,
  handleDelete,
  handleClearFilters,
  handleAddOrEditPost,
  loading,
  hasMore,
  isLoadingMore,
  observerTarget,
  isSearching,
}) {
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
              <p className="text-sm text-gray-600">
                Create, edit, and manage your blog posts
              </p>
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
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* New Post Button */}
            <button
              onClick={() => {
                setNewPost({
                  title: "",
                  content: "",
                  caption: "",
                  category: "",
                  tag: "",
                  image: "",
                });
                setEditPostId(null);
                setShowModal(true);
              }}
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
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="hover:text-purple-900"
                >
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
      {loading ? (
        <SkeletonLoaderForPosts />
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                {post.image && (
                  <div className="relative h-24 overflow-hidden">
                    <img
                      src={post.image || notFoundImage}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.src = notFoundImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category */}
                    <span className="absolute top-2 left-2 bg-white/80 text-gray-800 text-[11px] px-2 py-0.5 rounded-full backdrop-blur shadow-sm">
                      {post.category}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-3">
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                    {post.title}
                  </h3>

                  {/* Date */}
                  <p className="text-[11px] text-gray-500 mb-3">
                    {formatDate(post.createdAt)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md py-1.5 hover:bg-blue-100 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-red-600 bg-red-50 rounded-md py-1.5 hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite Scroll Trigger & Loading State */}
          <div
            ref={observerTarget}
            className="mt-6 flex flex-col items-center justify-center"
          >
            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading more posts...</span>
              </div>
            )}

            {/* Searching indicator */}
            {isSearching && isLoadingMore && posts.length === 0 && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching posts...</span>
              </div>
            )}

            {/* End of posts message */}
            {!hasMore && posts.length > 0 && !isSearching && (
              <p className="text-gray-400 text-sm">
                You've reached the end of the posts
              </p>
            )}

            {/* No more results for search */}
            {!hasMore && posts.length > 0 && isSearching && (
              <p className="text-gray-400 text-sm">
                No more results found for "{searchQuery}"
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchQuery || selectedCategory
              ? "No matching posts found"
              : "No posts yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || selectedCategory
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first blog post"}
          </p>
          {searchQuery || selectedCategory ? (
            <button
              onClick={handleClearFilters}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
            >
              <X className="w-5 h-5" />
              <span>Clear Filters</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setNewPost({
                  title: "",
                  content: "",
                  caption: "",
                  category: "",
                  tag: "",
                  image: "",
                });
                setEditPostId(null);
                setShowModal(true);
              }}
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

