import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../redux/store/store";

const UserPrivateRoute = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default UserPrivateRoute;
