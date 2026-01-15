import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Calendar, EyeIcon } from "lucide-react";
import ShareButton from "../utils/ShareButton";
import useAllPosts from "../hooks/useAllPosts";
import { formatDate } from "../utils/formatDate";
import {SkeletonLoader} from "../utils/SkeletonLoader";

export default function AllPosts() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryFromURL = params.get("category") || "All";

  const {
    selectedCategory,
    setSelectedCategory,
    posts,
    categories,
    loading,
    error,
  } = useAllPosts(categoryFromURL);

  // Scroll top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, categoryFromURL]);

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
          Showing latest posts for{" "}
          <span className="font-medium">{selectedCategory}</span>
        </p>

        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mb-6 block w-full sm:w-auto px-4 py-2 border rounded-lg bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {/* Loading */}
        {loading && (
          <SkeletonLoader
            count={8}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          />
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {posts.length ? (
              posts.map((post) => {
                return (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[260px]"
                  >
                    {/* Top Row: Image + Title */}
                    <div className="flex gap-4 mb-3">
                      {/* Thumbnail */}
                      {post.image ? (
                        <img
                          src={post.image}
                          alt="post"
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0" />
                      )}

                      {/* Title + Category */}
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-blue-600 mb-1">
                          {post.category}
                        </span>

                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                    </div>

                    {/* Caption / Excerpt */}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {post.caption || post.content}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <span className="flex items-center gap-1">
                          <MessageCircle size={15} />
                          {post.commentCount}
                        </span>

                        <span className="flex items-center gap-1">
                          <EyeIcon size={15} />
                          {post.views}
                        </span>

                        <ShareButton
                          url={`/blog/${post.id}`}
                          title={post.title}
                          className="hover:text-blue-600"
                        />
                      </div>

                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={13} />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                No posts found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

