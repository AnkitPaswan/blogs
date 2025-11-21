import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AllPosts from "./pages/AllPosts";
import Footer from "./components/Footer";
import SocialMedia from "./pages/Socialmedia";
import UnderConstruction from "./pages/Working";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
import ScrollToTop from "./components/ScrollToTop";

function App() {

  return (
      <Router>
        <ScrollToTop/>
         <AppContent />
      </Router>
  );
}

function AppContent() {
   const location = useLocation();
  const isAdmin = location.pathname === '/Admin' || location.pathname === '/admin-login';
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
   <>
   {!isAdmin && <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
        {!isAdmin && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        <div className={isAdmin ? "min-h-screen" : "pt-[120px] md:pt-[112px] min-h-screen"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/AllPosts" element={<AllPosts />} />
            <Route path="/Working" element={<UnderConstruction/>} />
            {/* <Route path="/Admin" element={<SignIn/>} /> */}
            <Route path="/Admin" element={<AdminDashboard/>} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
          {!isAdmin && <Footer />}
        </div>
   </>
  );
}

export default App;