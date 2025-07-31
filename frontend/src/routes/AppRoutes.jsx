import { Routes, Route } from "react-router-dom";
//Credential Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
//Layouts
import AuthLayout from "../layout/AuthLayout";
import AdminLayout from "../layout/AdminLayout.jsx";
import DeveloperLayout from "../layout/DevelopersLayout.jsx";
//Admin Part
import AdminHome from "../pages/Admin/Dashboard.jsx";
import AdminQuestions from "../pages/Admin/Questions.jsx";
import AdminTags from "../pages/Admin/Tags.jsx";
import AskQuestions from "../pages/Admin/AskQuestions.jsx";
import QuestionDetail from "../pages/Admin/QuestionDetail.jsx";
import MyPost from "../pages/Admin/MyPost.jsx";
import EditQuestion from "../pages/Admin/EditQuestion.jsx";
import SavedQuestion from "../pages/Admin/SavedQuestion.jsx";
import AdminProfile from "../pages/Admin/AdminProfile.jsx";
//User Part
import UserHome from "../pages/Devlopers/Dashboard";
import UserQuestions from "../pages/Devlopers/UserQuestions.jsx";
import UserAskQuestion from "../pages/Devlopers/UserAskQuestion.jsx";
import UserQuestionDetail from "../pages/Devlopers/UserQuestionDetail.jsx";
import UserSavedQuestion from "../pages/Devlopers/UserSavedQuestion.jsx";
import UserTags from "../pages/Devlopers/Tags.jsx";
import UserMyPosts from "../pages/Devlopers/UserMyPosts.jsx";
import UserEditQuestion from "../pages/Devlopers/UserEditQuestion.jsx";
import UserProfile from "../pages/Devlopers/UserProfile.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Home page - standalone */}
      <Route path="/" element={<Home />} />

      {/* Auth pages - wrapped in AuthLayout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Protected Dashboards */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="home" element={<AdminHome />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="questions/ask" element={<AskQuestions />} />
        <Route path="questions/:id" element={<QuestionDetail />} />
        <Route path="saved" element={<SavedQuestion />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="my-posts" element={<MyPost />} />
        <Route path="my-posts/edit/:id" element={<EditQuestion />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="/user" element={<DeveloperLayout />}>
        <Route path="home" element={<UserHome />} />
        <Route path="questions" element={<UserQuestions />} />
        <Route path="questions/ask" element={<UserAskQuestion />} />
        <Route path="questions/:id" element={<UserQuestionDetail />} />
        <Route path="saved" element={<UserSavedQuestion />} />
        <Route path="tags" element={<UserTags />} />
        <Route path="my-posts" element={<UserMyPosts />} />
        <Route path="my-posts/edit/:id" element={<UserEditQuestion />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}
