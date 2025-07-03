import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "./../../assets/logo/UttarLogo.png";

export default function LoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center">
      {/* Logo at the top with reduced margin */}
      <img src={Logo} alt="Logo" className="h-16 mb-4" />
      
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
        
        {/* Password Field with Forget Password on same line */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <a href="#" className="text-sm text-cyan-600 hover:text-cyan-800 hover:underline">
              Forget Password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-600"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {/* Login Button */}
        <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 mt-6">
          Log In
        </button>
        
        {/* Vertical Line - 60% black */}
        <div className="w-full flex justify-center my-6">
          <div className="h-px w-full bg-gray-300 relative">
          </div>
        </div>
      </div>
      
      {/* Sign Up Link with reduced margin */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="text-cyan-600 hover:text-cyan-800 hover:underline font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
