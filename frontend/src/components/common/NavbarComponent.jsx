import React from "react";
import { Search, Menu } from "lucide-react";
import LogoBlackText from "./../../assets/logo/LogoBlackText.png";

export default function NavbarComponent({ onToggleSidebar }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Menu Button */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="text-gray-400 hover:text-gray-600 mr-4"
          >
            <Menu size={40} />
          </button>

          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <img src={LogoBlackText} alt="Mentaro Logo" className="h-10" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Services
            </a>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search.."
                className="w-full px-4 py-2 pl-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search.."
              className="w-full px-4 py-2 pl-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
