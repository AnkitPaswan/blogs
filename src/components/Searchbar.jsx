import { Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { searchPosts } from "../services/api";

export default function Searchbar({ className = "" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchPosts(query);
          setResults(searchResults);
          setIsOpen(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

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
  };

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-blue-500 overflow-hidden z-50 max-h-96 overflow-y-auto">
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
                        {post.title || post.content?.substring(0, 50) + "..."}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query.trim().length >= 2 ? (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

