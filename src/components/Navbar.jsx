import {
  X,
  Search,
  Menu,
  BarChart3,
  FileText,
  Clock,
  Bookmark,
  Briefcase,
  Bell,
  Sliders,
  Dices,
  Package,
  Home as HomeIcon,
  LayoutDashboard as LayoutDashboardIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Searchbar from "./Searchbar";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef(null);

  // Define the sidebar menu items and tools
  const menuItems = [
    { name: "Home", icon: HomeIcon },
    { name: "About", icon: FileText },
    // { name: "Ideas Dashboard", icon: BarChart3 },
    // { name: "Results", icon: FileText },
    // { name: "Timeline", icon: Clock },
    // { name: "Watchlist", icon: Bookmark },
    // { name: "Portfolio", icon: Briefcase },
    // { name: "Alerts", icon: Bell },
    // { name: "Dashboard", icon: LayoutDashboardIcon },
  ];

  // const tools = [
  //   { name: "Stock Screener", icon: Sliders },
  //   { name: "Market", icon: Dices },
  //   { name: "Raw Material", icon: Package },
  // ];

  // Helper function to generate the correct URL path
  const getPath = (name) => {
    if (name === "Home") return "/";
    if (name === "About") return "/about";
    if (name === "Dashboard") return "/dashboard";
    return "/working";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile search when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
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
          {/* DESKTOP SEARCH */}
          <div className="hidden sm:block w-[350px]">
            <Searchbar />
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
          ref={mobileSearchRef}
          className="
            sm:hidden fixed top-0 left-0 w-full bg-white
            px-4 py-3 shadow-lg z-50 flex items-center
            animate-slideDown
          "
        >
          <div className="flex-1">
            <Searchbar />
          </div>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="ml-3 p-2 rounded-full bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          {/* Sidebar Menu Items */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                onClick={() => {
                  navigate(getPath(item.name));
                  setIsMenuOpen(false);
                }}
                key={item.name}
                className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                <Icon size={20} className="mr-2" />
                {item.name}
              </button>
            );
          })}

          {/* Tools */}
          {/* <div className="border-t" />
          {tools.map((item) => {
            const Icon = item.icon;
            return (
              <button
                onClick={() => {
                  navigate(getPath(item.name));
                  setIsMenuOpen(false);
                }}
                key={item.name}
                className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                <Icon size={20} className="mr-2" />
                {item.name}
              </button>
            );
          })} */}
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
