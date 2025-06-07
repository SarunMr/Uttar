import React from 'react';
import { Search } from 'lucide-react';
import LogoBlackText from "./../assets/logo/LogoBlackText.png"

export default function UttarHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
 <div className="flex items-center">
          <img src={LogoBlackText} alt="Mentaro Logo" className="h-10" />
        </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
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

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
<button className="px-4 py-2 text-cyan-500 hover:text-cyan-600 border border-cyan-500 hover:border-cyan-600 font-medium transition-colors">
  Login
</button>
            <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-md transition-colors">
              Sign up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
