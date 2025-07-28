// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import Logo from "./../assets/logo/UttarLogo.png";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  // Form state - 6 fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Handle select change (for gender)
  const handleGenderChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
    if (error) setError("");
  };

const validateForm = () => {
  if (!formData.firstName.trim()) {
    setError("First name is required");
    return false;
  }

  // Last Name validation
  if (!formData.lastName.trim()) {
    setError("Last name is required");
    return false;
  }

  // Username validation
  if (!formData.username.trim()) {
    setError("Username is required");
    return false;
  }
  if (formData.username.trim().length < 3) {
    setError("Username must be at least 3 characters");
    return false;
  }
  if (formData.username.trim().length > 30) {
    setError("Username must be no more than 30 characters");
    return false;
  }
  if (!/^[a-zA-Z0-9]+$/.test(formData.username.trim())) {
    setError("Username can only contain letters and numbers");
    return false;
  }

  // Email validation
  if (!formData.email.trim()) {
    setError("Email is required");
    return false;
  }
  if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
    setError("Please enter a valid email");
    return false;
  }

  // Password validation
  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return false;
  }
// Check for lowercase letter
if (!/[a-z]/.test(formData.password)) {
  setError("Password must contain at least one lowercase letter");
  return false;
}

// Check for uppercase letter
if (!/[A-Z]/.test(formData.password)) {
  setError("Password must contain at least one uppercase letter");
  return false;
}

// Check for number
if (!/\d/.test(formData.password)) {
  setError("Password must contain at least one number");
  return false;
}

  // Confirm Password validation
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return false;
  }

  // Gender validation
  if (!formData.gender) {
    setError("Please select your gender");
    return false;
  }
  if (!["male", "female", "other", "prefer-not-to-say"].includes(formData.gender)) {
    setError("Please select a valid gender option");
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
        "http://localhost:5000/api/auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
        },
      );

      console.log("Registration successful:", response.data);

      // Redirect to login page on success
      navigate("/auth/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
        <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src={Logo} alt="Mentaro Logo" className="h-10" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Join Us
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create your account and start your coding journey with our
              community
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Name Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

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
                />
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="focus:ring-cyan-500 focus:border-cyan-500">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="focus:ring-cyan-500 focus:border-cyan-500 pr-10"
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="focus:ring-cyan-500 focus:border-cyan-500 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm pt-4">
                <span className="text-gray-600">Already have an account? </span>
                <Link
                  to="/auth/login"
                  className="text-cyan-600 hover:text-cyan-500 font-medium underline-offset-4 hover:underline"
                >
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
