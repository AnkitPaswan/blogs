import { BarChart3, FileText, Tag, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import hook

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate(); // ✅ Initialize inside component

  const menuItems = [
    { name: "Dashboard", icon: BarChart3 },
    { name: "Manage Posts", icon: FileText },
    { name: "Manage Categories", icon: Tag },
  ];

  const handleLogout = () => {
    // Clear user data and token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/admin-login"); // Navigate to admin login page
  };

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-slate-400">Management Console</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActive(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Settings Section */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">
            System
          </h3>
          {/* <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group mb-2">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span className="font-medium">Settings</span>
          </button> */}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
