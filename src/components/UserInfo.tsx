import { useSushiGo } from "../contexts/SushiGoContext";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
	const { user } = useSushiGo();
	const logout = useLogout();
	const navigate = useNavigate();

	return (
		<div className="user-info-container">
			Logged in as: { user.username }
			<button
				onClick={async () => {
					await logout();
					navigate('/login');
				}}
			>
				Log out
			</button>
		</div>
	);
}

export default UserInfo;