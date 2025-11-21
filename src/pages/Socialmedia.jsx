import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, User,MessageCircle,Heart,Repeat2 } from "lucide-react";
import { fetchCategories, fetchPosts } from "../services/api";


const SocialMedia = () => {
  const location = useLocation(); // ✅ Get current URL
  const carouselRefs = useRef({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        {categories.map((category) => {
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

                        {/* User Info */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {post.user}
                            </p>
                            <p className="text-xs text-gray-500">
                              {post.handle}
                            </p>
                          </div>
                        </div>

                        {/* Post Text */}
                        <p className="text-sm text-gray-800 whitespace-pre-line mb-2 line-clamp-3 min-h-[48px] leading-relaxed">
                          {post.text}
                        </p>

                        {/* Image */}
                        {post.image && (
                          <img
                            src={post.image}
                            alt="post"
                            className="w-full h-36 object-cover rounded-lg mb-3 border"
                          />
                        )}

                        {/* BOTTOM FIXED SECTION */}
                        <div className="mt-auto">
                          {/* Stats */}
                          <div className="flex items-center text-gray-500 text-[11px] py-5 border-b border-indigo-200 h-[34px]">
                            <div className="flex space-x-4">
                              <span>
                                <MessageCircle className="inline-block w-4 h-4 mr-1" />
                                 {post.comments}</span>
                              <span>
                                <Repeat2 className="inline-block w-4 h-4 mr-1" />
                                {post.retweets}</span>
                              <span>
                                <Heart className="inline-block w-4 h-4 mr-1" />
                                {post.likes}</span>
                            </div>
                            <span className="ml-auto text-gray-400 text-[12px]">
                              {post.date}
                            </span>
                          </div>

                          {/* Tags */}
                          <div className="flex justify-between items-center pt-2 text-[10px]">
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-s-sm font-medium">
                              {post.category}
                            </span>
                            <span className="text-gray-500 font-medium">
                              {post.tag}
                            </span>
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
