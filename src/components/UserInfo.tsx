import { useUser } from "../contexts/UserContext";

const UserInfo = () => {
	const { user } = useUser();
	return (
		<div className="user-info-container">
			Logged in as: { user.username }
		</div>
	);
}

export default UserInfo;