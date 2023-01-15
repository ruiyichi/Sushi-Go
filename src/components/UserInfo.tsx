import { useSushiGo } from "../contexts/SushiGoContext";

const UserInfo = () => {
	const { user } = useSushiGo();
	return (
		<div className="user-info-container">
			Logged in as: { user.username }
		</div>
	);
}

export default UserInfo;