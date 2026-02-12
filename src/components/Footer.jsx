import React from "react";
import { Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Top Section */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12 
                      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
                      gap-y-10 gap-x-8 text-center"
      >
        {/* Column 1 - Logo */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-indigo-600 tracking-wider">
            BLOGS
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-3 leading-relaxed">
            © 2025 BLOGS Financial Services Private Limited <br />
            (formerly “BLOGS Advisory Services{" "}
            <br className="hidden sm:block" /> Private Limited”)
          </p>

          <p className="text-xs text-gray-400 mt-2 italic">
            Empowering your financial journey.
          </p>
        </div>

        {/* Column 2 - Policies */}
        <div>
          <h3 className="text-sm sm:text-md font-bold mb-3 text-gray-800 uppercase tracking-wide">
            POLICIES
          </h3>

          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Terms of Use
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Cancellation Policy
            </li>
          </ul>
        </div>

        {/* Column 3 - About */}
        <div>
          <h3 className="text-sm sm:text-md font-bold mb-3 text-gray-800 uppercase tracking-wide">
            ABOUT
          </h3>

          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Features
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              What's New
            </li>
            <li className="hover:text-indigo-600 transition cursor-pointer">
              Pricing
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-4 sm:gap-10">
            {/* Social Icons */}
            <div className="flex items-center space-x-4 order-1 sm:order-none">
              <span className="text-xs font-bold text-gray-600">CONNECT</span>

              <a href="#" className="hover:text-indigo-600">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-indigo-600 transition" />
              </a>

              <a href="#">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-indigo-600 transition" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-[11px] sm:text-xs text-gray-500 text-center order-2 sm:order-none">
              © {new Date().getFullYear()} BLOGS Financial Services Private
              Limited | All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
