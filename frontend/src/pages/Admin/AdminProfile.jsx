import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Save,
  Edit,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  Shield,
  Lock,
} from "lucide-react";
import axios from "axios";

export default function AdminProfile() {
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    gender: "",
    role: "",
    createdAt: "",
    lastLogin: "",
  });

  // Form state (removed email from formData since it's not editable)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL = "http://localhost:5000";

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const userData = response.data.data;
        setProfile(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          gender: userData.gender,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate form (removed email validation)
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      errors.username = "Username can only contain letters and numbers";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword =
          "Current password is required to set new password";
      }
      if (formData.newPassword.length < 6) {
        errors.newPassword = "New password must be at least 6 characters";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission (removed email from updateData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        gender: formData.gender,
        // Email is not included since it's not editable
      };

      // Add password fields if provided
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        const updatedProfile = response.data.data;
        setProfile(updatedProfile);
        setFormData((prev) => ({
          ...prev,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          username: updatedProfile.username,
          gender: updatedProfile.gender,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setSuccess("Profile updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate avatar color based on name
  const getAvatarColor = (firstName, lastName) => {
    const colors = [
      "bg-red-100 text-red-700",
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-yellow-100 text-yellow-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
      "bg-cyan-100 text-cyan-700",
    ];
    const nameHash = (firstName + lastName).length;
    return colors[nameHash % colors.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-800">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback
                    className={cn(
                      "text-2xl font-semibold",
                      getAvatarColor(profile.firstName, profile.lastName),
                    )}
                  >
                    {profile.firstName?.[0]?.toUpperCase()}
                    {profile.lastName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-lg font-semibold mt-3">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-gray-600">@{profile.username}</p>
              </div>

              {/* Profile Stats */}
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-cyan-500" />
                  <span className="font-medium">Role:</span>
                  <span className="capitalize bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
                    {profile.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-600 truncate">
                    {profile.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Joined:</span>
                  <span className="text-gray-600">
                    {formatDate(profile.createdAt)}
                  </span>
                </div>
                {profile.lastLogin && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Last Login:</span>
                    <span className="text-gray-600">
                      {formatDate(profile.lastLogin)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className={cn(
                        "border-cyan-200 focus:border-cyan-400",
                        formErrors.firstName && "border-red-500",
                      )}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-600 text-xs">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className={cn(
                        "border-cyan-200 focus:border-cyan-400",
                        formErrors.lastName && "border-red-500",
                      )}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-600 text-xs">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className={cn(
                        "border-cyan-200 focus:border-cyan-400",
                        formErrors.username && "border-red-500",
                      )}
                    />
                    {formErrors.username && (
                      <p className="text-red-600 text-xs">
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  {/* Email Field - READ ONLY */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      Email
                      <Lock className="h-3 w-3 text-gray-400" />
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Email cannot be changed for security reasons
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "border-cyan-200 focus:border-cyan-400",
                        formErrors.gender && "border-red-500",
                      )}
                    >
                      <SelectValue placeholder="Select gender" />
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
                  {formErrors.gender && (
                    <p className="text-red-600 text-xs">{formErrors.gender}</p>
                  )}
                </div>

                {/* Password Change Section */}
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600">
                    Leave blank to keep current password
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) =>
                          handleInputChange("currentPassword", e.target.value)
                        }
                        className={cn(
                          "border-cyan-200 focus:border-cyan-400 pr-10",
                          formErrors.currentPassword && "border-red-500",
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {formErrors.currentPassword && (
                      <p className="text-red-600 text-xs">
                        {formErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) =>
                            handleInputChange("newPassword", e.target.value)
                          }
                          className={cn(
                            "border-cyan-200 focus:border-cyan-400 pr-10",
                            formErrors.newPassword && "border-red-500",
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {formErrors.newPassword && (
                        <p className="text-red-600 text-xs">
                          {formErrors.newPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={cn(
                            "border-cyan-200 focus:border-cyan-400 pr-10",
                            formErrors.confirmPassword && "border-red-500",
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-red-600 text-xs">
                          {formErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-32"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
