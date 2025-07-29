import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, LogIn, CheckCircle } from "lucide-react";
import Logo from "./../assets/logo/UttarLogo.png";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if there's a success message from registration
  const successMessage = location.state?.message;

  // Form state - only email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Form validation
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      console.log("Login successful:", response.data);

      // Store token and user in localStorage
      const { token, user } = response.data.data || {};

      if (token) {
        localStorage.setItem("token", token);
        // Save user object as JSON
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Redirect by role
      if (user?.role === "admin") {
        navigate("/admin/home", {
          state: { message: "Welcome admin!" },
        });
      } else {
        navigate("/user/dashboard", {
          state: { message: "Welcome user!" },
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Clear any previous login info on error (optional)
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (error.response?.status === 404) {
        setError("No account found with this email address.");
      } else {
        setError("Login failed. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <img src={Logo} alt="Mentaro Logo" className="h-10" />
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success message from registration */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className="focus:ring-cyan-500 focus:border-cyan-500"
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className="focus:ring-cyan-500 focus:border-cyan-500 pr-10"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>

          {/* Register Link */}
          <div className="text-center text-sm pt-4">
            <span className="text-gray-600">Don't have an account yet? </span>
            <Link
              to="/auth/register"
              className="text-cyan-600 hover:text-cyan-500 font-medium underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
