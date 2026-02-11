import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Calendar,
  EyeIcon,
} from "lucide-react";
import { fetchHomePosts } from "../services/api";
import ShareButton from "../utils/ShareButton";
import { SkeletonLoaderForHome } from "../utils/SkeletonLoader";
import ErrorState from "../utils/ErrorState";
import { formatDate } from "../utils/formatDate";
import DOMPurify from "dompurify";
import notFoundImage from "/assets/notfound.webp";

const SocialMedia = () => {
  const location = useLocation();
  const carouselRefs = useRef({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top on navigation or category change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, selectedCategory]);

  // If you get category from URL, you can set it here
  const params = new URLSearchParams(location.search);
  const categoryFromURL = params.get("category");
  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

  const loadData = async () => {
    try {
      const response = await fetchHomePosts();
      
      if (response.success && response.data) {
        const categoriesFromAPI = Object.keys(response.data);
        setCategories(categoriesFromAPI);
        
        // Flatten all posts from all categories and sort by createdAt (newest first)
        const allPosts = Object.values(response.data)
          .flat()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(allPosts);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle retry when error occurs
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadData();
  };

  useEffect(() => {
    loadData();
    // Auto-refresh blogs every 15 minutes (900000 ms)
    const intervalId = setInterval(loadData, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const scrollCarousel = (category, direction) => {
    const carouselElement = carouselRefs.current[category];
    if (!carouselElement) return;

    const scrollAmount =
      direction === "left"
        ? -carouselElement.offsetWidth * 0.9
        : carouselElement.offsetWidth * 0.9;

    carouselElement.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Get the latest post date for each category
  const getLatestPostDate = (category) => {
  if (!Array.isArray(posts)) return new Date(0);

  const filtered = posts.filter(p => p?.category === category);
  if (!filtered.length) return new Date(0);

  return new Date(
    Math.max(...filtered.map(p => new Date(p.createdAt).getTime()))
  );
};


  // Sort categories by latest post date (most recent first)
  const sortedCategories = [...categories].sort((a, b) => {
    return getLatestPostDate(b) - getLatestPostDate(a);
  });

  // Post Card Component (same design as AllPosts)
  const PostCard = ({ post }) => {
    const postId = post.id || post._id;

    return (
      <Link
        to={`/blog/${postId}`}
        className="
          group
          bg-white
          border border-gray-200
          rounded-xl
          p-4
          shadow-sm
          hover:shadow-xl
          transition-all duration-300
          flex flex-col
          h-[260px]
          w-full xs:w-[88vw] sm:w-72 md:w-80
          flex-shrink-0
        "
      >
        {/* Top Row: Image + Title */}
        <div className="flex gap-4 mb-3">
          {/* Thumbnail */}
          {post.image ? (
            <img
              src={post.image || notFoundImage}
              alt="post"
              onError={(e) => {
                e.currentTarget.src = notFoundImage;
              }}
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
            <h3 className="text-m font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
              {post.title}
            </h3>
          </div>
        </div>

        <div
          className="text-sm text-gray-600 line-clamp-3 mb-4 prose prose-sm max-w-none prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content || post.caption),
          }}
        />

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
              url={`/blog/${postId}`}
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
  };

  if (loading) {
    return <SkeletonLoaderForHome />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to Load Posts"
        message={error}
        onRetry={handleRetry}
        showRetry={true}
        showHome={true}
        className="min-h-screen bg-gray-50"
      />
    );
  }

  return (
    <div className="p-4 md:p-10 md:pt-0 rounded-xl bg-gray-50">
      <div className="pr-0 sm:pr-16 md:pr-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
          Trending Social Updates by Category
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mb-10">
          Updates every 15 minutes
        </p>

        {/* Trending Post Section - Latest 10 posts from all categories */}
        <section className="mb-14">
          {/* Heading Row */}
          <div className="flex justify-between items-center mb-5 border-b border-indigo-200 pb-2">
            <h3 className="text-2xl md:text-3xl font-semibold text-indigo-700">
              Trending Posts
            </h3>
            <Link
              to="/allposts"
              className="text-indigo-600 text-sm font-medium hover:underline flex-shrink-0"
            >
              <span className="flex items-center gap-1">
                View all
                <ChevronRight size={15} />
              </span>
            </Link>
          </div>

          {/* Carousel Wrapper */}
          <div className="relative -ml-4 -mr-2 px-0 md:px-0 md:ml-0 md:mr-0">
            {/* Left Arrow - Hidden on mobile */}
            <button
              onClick={() => scrollCarousel("trending", "left")}
              className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right Arrow - Hidden on mobile */}
            <button
              onClick={() => scrollCarousel("trending", "right")}
              className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition"
            >
              <ChevronRight size={22} />
            </button>

            {/* Scrollable Area - Latest 10 posts */}
            <div
              ref={(el) => (carouselRefs.current["trending"] = el)}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              <div className="flex gap-3 py-3 px-2 xs:px-0 snap-x snap-mandatory">
                {posts.slice(0,8).map((post) => (
                  <div
                    key={post.id}
                    className="snap-center flex-shrink-0 w-[75vw] xs:w-[75vw] sm:w-72 md:w-80"
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {sortedCategories.map((category) => {
          const categoryPosts = posts
            .filter((post) => post.category === category)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          if (!categoryPosts.length) return null;

          return (
            <section key={category} className="mb-14">
              {/* Heading Row */}
              <div className="flex justify-between items-center mb-5 border-b border-indigo-200 pb-2">
                <h3 className="text-2xl md:text-3xl font-semibold text-indigo-700">
                  {category}
                </h3>
                <Link
                  to={`/allposts?category=${category}`}
                  className="text-indigo-600 text-sm font-medium hover:underline flex-shrink-0"
                >
                  <span className="flex items-center gap-1">
                    View all
                    <ChevronRight size={15} />
                  </span>
                </Link>
              </div>

              {/* Carousel Wrapper */}
              <div className="relative -ml-4 -mr-4 px-2 md:px-0 md:ml-0 md:mr-0">
              {/* Left Arrow - Hidden on mobile */}
                <button
                  onClick={() => scrollCarousel(category, "left")}
                  className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Right Arrow - Hidden on mobile */}
                <button
                  onClick={() => scrollCarousel(category, "right")}
                  className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Scrollable Area */}
                <div
                  ref={(el) => (carouselRefs.current[category] = el)}
                  className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                >
                  <div className="flex gap-3 py-3 px-0 xs:px-0 snap-x snap-mandatory">
                    {categoryPosts.map((post) => (
                      <div
                        key={post.id}
                        className="snap-center flex-shrink-0 w-[75vw] xs:w-[75vw] sm:w-72 md:w-80"
                      >
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMedia;
