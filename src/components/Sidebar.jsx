import { useState } from "react";
import {
  BarChart3, FileText, Clock, Bookmark, Briefcase, Bell,
  Sliders, Dices, Package,
  HomeIcon,
  LayoutDashboardIcon
} from "lucide-react";
import { Link } from "react-router-dom";

// 1. Define the path for your placeholder page
const UNDER_CONSTRUCTION_PATH = "/working";

// Helper function to generate the correct URL path
const getPath = (name) => {
    if (name === "Home") return "/";
    if (name === "About") return "/about";

    if (name === "Dashboard") return "/dashboard";

    return UNDER_CONSTRUCTION_PATH;
};

export default function Sidebar() {
  const [active, setActive] = useState("Home");

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

  // 4. Function to handle the click and set the active state
  const handleItemClick = (name) => {
    // We still set the active state to the actual item name
    // to visually highlight the selected item in the sidebar.
    setActive(name);
  };

  return (
    <div className="hidden md:block fixed right-0 top-[88px] bottom-0 w-16 md:w-20 bg-white border-l shadow-sm flex flex-col justify-between z-40">

      {/* Top Menu Items Section */}
      <div className="flex flex-col items-center pt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = (active === item.name) || (item.name !== "Home" && active.startsWith(item.name.split(" ")[0]));

          return (
            <Link
              to={getPath(item.name)}
              key={item.name}
              // 6. Use the new handler
              onClick={() => handleItemClick(item.name)}
              className={`flex flex-col items-center w-full py-1 hover:bg-gray-100 text-[10px] transition-colors ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-600"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-8 rounded-full mb-0.5 ${
                  isActive ? "bg-blue-100" : ""
                }`}
              >
                <Icon size={20} />
              </div>
              <span className="text-center text-[8px] leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Tools Section */}
      <div
        className="flex flex-col items-center pb-[60px] md:pb-12"
      >
        {/* <div className="border-t w-full mb-1" />
        {tools.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          return (
            <Link
              // 7. Use the modified getPath here too
              to={getPath(item.name)}
              key={item.name}
              // 8. Use the new handler
              onClick={() => handleItemClick(item.name)}
              className={`flex flex-col items-center w-full py-1 hover:bg-gray-100 text-[10px] transition-colors ${
                isActive ? "text-yellow-600 font-semibold" : "text-gray-600"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-8 rounded-full ${
                  isActive ? "bg-yellow-100" : ""
                }`}
              >
                <Icon size={20} />
              </div>
              <span className="text-center text-[8px] leading-tight">{item.name}</span>
            </Link>
          );
        })} */}
      </div>
    </div>
  );
}
