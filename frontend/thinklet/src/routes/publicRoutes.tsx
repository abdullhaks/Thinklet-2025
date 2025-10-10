import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../redux/store/store";

const UserPublicRoute = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return user ? <Navigate to="/home" /> : <Outlet />;
};

export default UserPublicRoute;