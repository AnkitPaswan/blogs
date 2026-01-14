import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, MessageCircle, Calendar, EyeIcon } from "lucide-react";
import { fetchCategories, fetchPosts } from "../services/api";
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

const SocialMedia = () => {
  const location = useLocation(); // ✅ Get current URL
  const carouselRefs = useRef({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [commentCounts, setCommentCounts] = useState({});

  // ✅ Scroll to top on navigation or category change
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedPosts] = await Promise.all([
          fetchCategories(),
          fetchPosts("All"),
        ]);
        setCategories(fetchedCategories.filter((cat) => cat !== "All"));
        setPosts(fetchedPosts);

        // Fetch comment counts for each post
        // const counts = {};
        // await Promise.all(
        //   fetchedPosts.map(async (post) => {
        //     try {
        //       const response = await commentsAPI.getComments(
        //         post.id || post._id
        //       );
        //       counts[post.id || post._id] = response.data.length;
        //     } catch (err) {
        //       counts[post.id || post._id] = 0;
        //       console.log(err);
              
        //     }
        //   })
        // );
        // setCommentCounts(counts);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
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
    const categoryPosts = posts.filter((post) => post.category === category);
    if (!categoryPosts.length) return new Date(0);

    // Try to parse dates, if not available use post id as fallback (assuming higher id = newer)
    const dates = categoryPosts.map((post) => {
      if (post.date) {
        const parsed = new Date(post.date);
        if (!isNaN(parsed)) return parsed;
      }
      // Fallback: use id as proxy for recency (higher id = newer)
      return new Date(post.id || 0);
    });

    return new Date(Math.max(...dates));
  };

  // Sort categories by latest post date (most recent first)
  const sortedCategories = [...categories].sort((a, b) => {
    return getLatestPostDate(b) - getLatestPostDate(a);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-10 rounded-xl bg-gray-50">
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
              View all →
            </Link>
          </div>

          {/* Carousel Wrapper */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollCarousel("trending", "left")}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition hidden sm:block"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scrollCarousel("trending", "right")}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition hidden sm:block"
            >
              <ChevronRight size={22} />
            </button>

            {/* Scrollable Area - Latest 10 posts */}
            <div
              ref={(el) => (carouselRefs.current["trending"] = el)}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              <div className="flex space-x-4 py-3">
                {posts.slice(0, 10).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="
                      w-[88vw] xs:w-[92vw]    
                      sm:w-72 md:w-80                
                      h-[400px]
                      border rounded-md p-4 
                      bg-white shadow-sm hover:shadow-xl 
                      transition cursor-pointer 
                      border-gray-200 flex-shrink-0 
                      flex flex-col snap-start select-none
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
                          to={`/blog/${post.id}`}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <MessageCircle className="text-gray-500" />
                          <span className="text-sm">
                            {post.commentCount}
                            {/* {commentCounts[post.id || post._id] || 0} */}
                          </span>
                          <EyeIcon className="text-gray-500" />
                          <span className="text-sm">
                            {post.views}
                          </span>
                        </Link>
                        <ShareButton
                          url={`/blog/${post.id || post._id}`}
                          title={
                            post.title || post.content?.substring(0, 50) + "..."
                          }
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
                ))}
              </div>
            </div>
          </div>
        </section>

        {sortedCategories.map((category) => {
          const categoryPosts = posts.filter(
            (post) => post.category === category
          );
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
                  View all →
                </Link>
              </div>

              {/* Carousel Wrapper */}
              <div className="relative">
                {/* Left Arrow */}
                <button
                  onClick={() => scrollCarousel(category, "left")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition hidden sm:block"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => scrollCarousel(category, "right")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-30 p-2 bg-white shadow-md rounded-full text-indigo-600 hover:bg-indigo-50 transition hidden sm:block"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Scrollable Area */}
                <div
                  ref={(el) => (carouselRefs.current[category] = el)}
                  className="overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                >
                  <div className="flex space-x-4 py-3">
                    {categoryPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="
                          w-[88vw] xs:w-[92vw]    
                          sm:w-72 md:w-80                
                          h-[400px]
                          border rounded-md p-4 
                          bg-white shadow-sm hover:shadow-xl 
                          transition cursor-pointer 
                          border-gray-200 flex-shrink-0 
                          flex flex-col snap-start select-none
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
                              to={`/blog/${post.id}`}
                              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <MessageCircle className="text-gray-500" />
                              <span className="text-sm">
                                {post.commentCount}
                                {/* {commentCounts[post.id || post._id] || 0} */}
                              </span>
                            </Link>
                            <div className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                              <EyeIcon className="text-gray-500" />
                              <span className="text-sm">{post.views}</span>
                            </div>
                            <ShareButton
                              url={`/blog/${post.id || post._id}`}
                              title={
                                post.title ||
                                post.content?.substring(0, 50) + "..."
                              }
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

