
import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";








const UserRoutes = () => {
  return (
    <Routes>


        <Route path="" element={<LandingPage />} />
        {/* <Route path="/login" element={<UserLogin />} /> */}
     
   

      <Route path="*" element={<Navigate to="/user/login" />} />

    </Routes>
  );
};

export default UserRoutes;