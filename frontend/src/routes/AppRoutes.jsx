import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AuthRoute from "../components/AuthRoute";

// Import your layouts
import AuthLayout from "../layout/AuthLayout.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import DeveloperLayout from "../layout/DevelopersLayout.jsx";

// Import your components
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Admin components
import AdminHome from "../pages/Admin/Dashboard.jsx";
import AdminQuestions from "../pages/Admin/Questions.jsx";
import AskQuestions from "../pages/Admin/AskQuestions.jsx";
import QuestionDetail from "../pages/Admin/QuestionDetail.jsx";
import SavedQuestion from "../pages/Admin/SavedQuestion.jsx";
import AdminTags from "../pages/Admin/Tags.jsx";
import MyPost from "../pages/Admin/MyPost.jsx";
import EditQuestion from "../pages/Admin/EditQuestion.jsx";
import AdminSearchUsers from "../pages/Admin/SearchPage.jsx";
import AdminPreviewProfile from "../pages/Admin/SearchProfilePreview.jsx";
import AdminProfile from "../pages/Admin/AdminProfile.jsx";

// User components
import UserHome from "../pages/Devlopers/Dashboard.jsx";
import UserQuestions from "../pages/Devlopers/UserQuestions.jsx";
import UserAskQuestion from "../pages/Devlopers/UserAskQuestion.jsx";
import UserQuestionDetail from "../pages/Devlopers/UserQuestionDetail.jsx";
import UserSavedQuestion from "../pages/Devlopers/UserSavedQuestion.jsx";
import UserTags from "../pages/Devlopers/Tags.jsx";
import UserMyPosts from "../pages/Devlopers/UserMyPosts.jsx";
import UserEditQuestion from "../pages/Devlopers/UserEditQuestion.jsx";
import UserSearchUsers from "../pages/Devlopers/UserSearchUsers.jsx";
import UserSearchPreview from "../pages/Devlopers/UserSearchPreview.jsx";
import UserProfile from "../pages/Devlopers/UserProfile.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home page - public access */}
      <Route path="/" element={<Home />} />

      {/* Auth pages - only accessible when not authenticated */}
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <AuthLayout />
          </AuthRoute>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin Dashboard - requires admin role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<AdminHome />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="questions/ask" element={<AskQuestions />} />
        <Route path="questions/:id" element={<QuestionDetail />} />
        <Route path="saved" element={<SavedQuestion />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="my-posts" element={<MyPost />} />
        <Route path="my-posts/edit/:id" element={<EditQuestion />} />
        <Route path="search" element={<AdminSearchUsers />} />
        <Route path="search/:id" element={<AdminPreviewProfile />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* User Dashboard - requires authentication (any role) */}
      <Route
        path="/user"
        element={
          <ProtectedRoute requireAdmin={false}>
            <DeveloperLayout />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<UserHome />} />
        <Route path="questions" element={<UserQuestions />} />
        <Route path="questions/ask" element={<UserAskQuestion />} />
        <Route path="questions/:id" element={<UserQuestionDetail />} />
        <Route path="saved" element={<UserSavedQuestion />} />
        <Route path="tags" element={<UserTags />} />
        <Route path="my-posts" element={<UserMyPosts />} />
        <Route path="my-posts/edit/:id" element={<UserEditQuestion />} />
        <Route path="search" element={<UserSearchUsers />} />
        <Route path="search/:id" element={<UserSearchPreview />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
