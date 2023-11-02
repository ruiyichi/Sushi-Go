import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const RequireAuth = () => {
  const { user } = useUser();
  const location = useLocation();

  return (
    user.username 
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;