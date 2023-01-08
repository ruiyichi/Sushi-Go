import { useAuth } from "../contexts/Auth";
import { useLocation, Navigate } from "react-router-dom";

const AuthenticatedRoute = ({ children }: { children: JSX.Element }) => {
	const { state } = useAuth();
	const location = useLocation();

	return state.auth
		? children
		:
		<Navigate to={'/login'} replace state={{ path: location.pathname }}/>;
}

export default AuthenticatedRoute;