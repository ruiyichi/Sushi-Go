import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSushiGo } from "../contexts/SushiGoContext";

const RequireAuth = () => {
  const { user } = useSushiGo();
  const location = useLocation();

  return (
    user.pwd 
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;