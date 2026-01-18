
import { Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { searchPosts, postsAPI } from "../services/api";

export default function Searchbar({ className = "" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initial search function
  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) return;

    setIsLoading(true);
    console.log("Searching for:", searchTerm);
    
    try {
      const response = await searchPosts(searchTerm);
      console.log("Initial search response:", response);
      
      // Handle both direct array and { posts: [...] } response
      const posts = Array.isArray(response) ? response : response.posts || [];
      
      setResults(posts);
      setNextCursor(response.nextCursor || null);
      setNextId(response.nextId || null);
      setHasMore(response.hasMore || false);
      setIsOpen(true);
      
      console.log("Initial results:", posts.length, "hasMore:", response.hasMore);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more results for infinite scroll
  const loadMore = useCallback(async () => {
    console.log("loadMore called:", { hasMore, isLoadingMore, nextCursor, nextId });
    
    if (!hasMore || isLoadingMore || !nextCursor || !query.trim()) {
      console.log("loadMore skipped:", { hasMore, isLoadingMore, nextCursor, query });
      return;
    }

    setIsLoadingMore(true);
    console.log("Fetching more posts with cursor:", nextCursor, "id:", nextId);
    
    try {
      const response = await postsAPI.searchPosts(query, 8, nextCursor, nextId);
      console.log("loadMore response:", JSON.stringify(response, null, 2));
      
      const posts = Array.isArray(response.data) ? response.data : response.data?.posts || [];
      console.log("New posts count:", posts.length);
      
      setResults(prev => [...prev, ...posts]);
      setNextCursor(response.data?.nextCursor || null);
      setNextId(response.data?.nextId || null);
      setHasMore(response.data?.hasMore || false);
      
      console.log("After loadMore - hasMore:", response.data?.hasMore, "nextCursor:", response.data?.nextCursor);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextCursor, nextId, query]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setIsOpen(false);
        setHasMore(true);
        setNextCursor(null);
        setNextId(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle scroll on dropdown - direct onScroll prop approach
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    console.log("Scrolling:", { scrollTop, scrollHeight, clientHeight, hasMore, isLoadingMore, nextCursor });
    
    // Check if user has scrolled to bottom (with 100px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      console.log("Near bottom, checking conditions:", { hasMore, isLoadingMore, nextCursor });
      if (hasMore && !isLoading && !isLoadingMore && nextCursor) {
        console.log("Triggering loadMore...");
        loadMore();
      }
    }
  }, [hasMore, isLoading, isLoadingMore, nextCursor, loadMore]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setHasMore(true);
    setNextCursor(null);
    setNextId(null);
  };

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setHasMore(true);
    setNextCursor(null);
    setNextId(null);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Search for latest articles..."
          className="
            w-full pl-10 pr-10 py-2 text-sm
            border border-gray-300
            rounded-xl
            text-gray-700
            placeholder-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
            transition
          "
        />
        {isLoading ? (
          <Loader2
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin"
          />
        ) : query ? (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          onScroll={handleScroll}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-blue-500 overflow-hidden z-50 max-h-96 overflow-y-auto"
        >
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((post) => (
                <li key={post.id || post._id}>
                  <Link
                    to={`/blog/${post.id || post._id}`}
                    onClick={handleResultClick}
                    className="flex items-start px-4 py-3 hover:bg-gray-50 transition"
                  >
                    {/* Image on the left */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt="post"
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 mr-3"
                      />
                    )}
                    {/* Content on the right */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 mb-1 truncate">
                        {post.title || post.caption || post.content?.substring(0, 50) + "..."}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {post.content || post.caption}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
              
              {/* Load More Indicator */}
              <li className="px-4 py-3 text-center">
                {isLoadingMore ? (
                  <div className="flex items-center justify-center gap-2 text-blue-500">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                ) : hasMore && nextCursor ? (
                  <span className="text-xs text-gray-400">Scroll for more...</span>
                ) : results.length > 0 ? (
                  <span className="text-xs text-gray-400">No more results</span>
                ) : null}
              </li>
            </ul>
          ) : query.trim().length >= 2 && !isLoading ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

