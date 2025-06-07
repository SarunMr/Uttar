import React from 'react';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import LogoWhiteText from "./../assets/logo/LogoWhiteText.png"

export default function UttarFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
        <div className="flex items-center">
          <img src={LogoWhiteText} alt="Mentaro Logo" className="h-10" />
        </div>
            </div>
          </div>

          {/* Uttar Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Uttar</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Questions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Tags Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Popular Tags</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Vim
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Rust
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Lua
                </a>
              </li>
            </ul>
          </div>

          {/* Tools Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  ReactJS
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Tailwindcss
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Node.JS
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  ExpressJs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            Copyright © Uttar 2025. All Rights Reserved
          </div>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
