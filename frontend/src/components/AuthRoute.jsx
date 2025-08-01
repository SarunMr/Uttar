import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AuthRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        // If user is authenticated, they shouldn't access auth pages
        setIsAuthenticated(true);
      } catch (error) {
        // Invalid user data in localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem("user"));
    const redirectPath = user.role === "admin" ? "/admin/home" : "/user/home";
    return <Navigate to={redirectPath} replace />;
  }

  // Not authenticated - allow access to auth pages
  return children;
};

export default AuthRoute;
