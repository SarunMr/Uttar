import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import LogoBlackText from "./../../assets/logo/LogoBlackText.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnLoginPage = location.pathname === "/auth/login";
  const isOnRegisterPage = location.pathname === "/auth/register";
  const isOnAuthPage = isOnLoginPage || isOnRegisterPage;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center space-x-2">
            <img src={LogoBlackText} alt="Mentaro Logo" className="h-10" />
          </div>
        </div>

        {/* Auth Buttons - Different text based on current page */}
        <div className="flex items-center space-x-3">
          {isOnRegisterPage ? (
            // On Register page - show "Sign In" button
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/auth/login")}
                className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
              >
                Sign In
              </Button>
            </>
          ) : isOnLoginPage ? (
            // On Login page - show "Sign Up" button
            <>
              <Button
                onClick={() => navigate("/auth/register")}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Sign Up
              </Button>
            </>
          ) : (
            // On Home page - show both buttons
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/auth/login")}
                className="text-gray-700 hover:text-cyan-600 hover:bg-cyan-50"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth/register")}
                className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
