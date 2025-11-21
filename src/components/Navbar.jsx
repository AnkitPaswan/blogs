import { X, Search, Menu, BarChart3, FileText, Clock, Bookmark, Briefcase, Bell, Sliders, Dices, Package, Home as HomeIcon, LayoutDashboard as LayoutDashboardIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Define the sidebar menu items and tools
  const menuItems = [
    { name: "Home", icon: HomeIcon },
    { name: "Ideas Dashboard", icon: BarChart3 },
    { name: "Results", icon: FileText },
    { name: "Timeline", icon: Clock },
    { name: "Watchlist", icon: Bookmark },
    { name: "Portfolio", icon: Briefcase },
    { name: "Alerts", icon: Bell },
    { name: "Dashboard", icon: LayoutDashboardIcon },
  ];

  const tools = [
    { name: "Stock Screener", icon: Sliders },
    { name: "Market", icon: Dices },
    { name: "Raw Material", icon: Package },
  ];

  // Helper function to generate the correct URL path
  const getPath = (name) => {
    if (name === "Home") return "/";
    if (name === "Dashboard") return "/dashboard";
    return "/working";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowMobileSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full shadow-sm fixed top-0 z-50 bg-white">

      {/* MAIN NAVBAR */}
      <div className="flex items-center justify-between px-4 md:px-20 py-3 bg-white relative">

        {/* LEFT — LOGO */}
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-extrabold tracking-widest text-black 
                     hover:text-pink-500 transition hover:scale-105"
        >
          BLOGS
        </button>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-2">

          {/* DESKTOP SEARCH BOX */}
          <div className="hidden sm:block relative w-[350px]">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search for letest articles..."
              className="
                w-full pl-10 pr-4 py-1.5 text-sm
                border border-gray-300
                rounded-xl
                text-gray-700
                placeholder-gray-400
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* MOBILE SEARCH ICON */}
          <button
            className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search size={22} className="text-gray-700" />
          </button>

          {/* MOBILE MENU ICON */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={toggleMenu}
          >
            <Menu size={22} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {showMobileSearch && (
        <div
          ref={searchRef}
          className="
            sm:hidden fixed top-0 left-0 w-full bg-white
            px-4 py-3 shadow-lg z-50 flex items-center space-x-3
            animate-slideDown
          "
        >
          {/* <Search size={20} className="text-gray-500" /> */}

          <input
            autoFocus
            type="text"
            placeholder="Search anything..."
            className="
              flex-1 py-2 px-2
              border border-gray-300
              rounded-xl text-sm
              focus:ring-2 focus:ring-blue-500 outline-none
            "
          />

          <button
            onClick={() => setShowMobileSearch(false)}
            className="p-2 rounded-full bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          {/* Main Nav Links */}
          {/* <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/AllPosts" className="block px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={toggleMenu}>
            All Posts
          </Link>
          <Link to="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-100" onClick={toggleMenu}>
            Contact
          </Link> */}

          {/* Sidebar Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                to={getPath(item.name)}
                key={item.name}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <Icon size={20} className="mr-2" />
                {item.name}
              </Link>
            );
          })}

          {/* Tools */}
          <div className="border-t" />
          {tools.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                to={getPath(item.name)}
                key={item.name}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100"
                onClick={toggleMenu}
              >
                <Icon size={20} className="mr-2" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* SECOND ROW GRADIENT */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 md:px-6 py-2 shadow-lg mt-0">
        <span className="text-white font-extrabold text-base flex items-center justify-center">
          <span className="mr-3 text-lg">✨</span>
          <span className="hidden sm:inline uppercase tracking-widest">
            Latest Exchange Filing Alert
          </span>
          <span className="sm:hidden uppercase tracking-wider">
            Filing Alert
          </span>
          <span className="ml-3 text-lg">✨</span>
        </span>
      </div>

    </div>
  );
}
