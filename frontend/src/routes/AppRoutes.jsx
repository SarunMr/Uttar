import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layout/AuthLayout";
//Admin Part
import AdminLayout from "../layout/AdminLayout.jsx";
import AdminHome from "../pages/Admin/Dashboard.jsx";
import AdminQuestions from "../pages/Admin/Questions.jsx";
import AdminTags from "../pages/Admin/Tags.jsx";
import AskQuestions from "../pages/Admin/AskQuestions.jsx";
import QuestionDetail from "../pages/Admin/QuestionDetail.jsx";
import AdminSettings from "../pages/Admin/Settings.jsx";
import MyPost from "../pages/Admin/MyPost.jsx";

import UserHome from "../pages/Devlopers/Dashboard";
import UserQuestions from "../pages/Devlopers/UserQuestions.jsx";
import UserAskQuestion from "../pages/Devlopers/UserAskQuestion.jsx";
import UserQuestionDetail from "../pages/Devlopers/UserQuestionDetail.jsx";
import UserTags from "../pages/Devlopers/Tags.jsx";
import DeveloperLayout from "../layout/DevelopersLayout.jsx";

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
        <Route path="tags" element={<AdminTags />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="questions/ask" element={<AskQuestions />} />
        <Route path="questions/:id" element={<QuestionDetail />} />
        <Route path="my-posts" element={<MyPost />} />
        <Route path="settings" element={<AdminSettings />} />

      </Route>

      <Route path="/user" element={<DeveloperLayout />}>
        <Route path="home" element={<UserHome />} />
        <Route path="questions" element={<UserQuestions />} />
        <Route path="questions/ask" element={<UserAskQuestion />} />
        <Route path="questions/:id" element={<UserQuestionDetail />} />
        <Route path="tags" element={<UserTags />} />
      </Route>
    </Routes>
  );
}
