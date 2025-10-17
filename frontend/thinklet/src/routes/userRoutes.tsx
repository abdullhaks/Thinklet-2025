import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Home } from "../pages/Home";
import UserPublicRoute from "../routes/publicRoutes";
import UserPrivateRoute from "../routes/privateRoutes";
import { ArticleList } from "../pages/MyArticles";
import { Profile } from "../pages/Profile";
import { CreateArticle } from "../pages/CreateArticle";
import { ArticleView } from "../pages/ArticleVeiw";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserPublicRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<UserPrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/settings" element={<Profile />} />
        <Route path="/create" element={<CreateArticle />} />
        <Route
          path="/edit/:articleId"
          element={<CreateArticle editMode={true} />}
        />
      </Route>
      <Route path="/article/:articleId" element={<ArticleView />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default UserRoutes;
