import { SERVER_URI } from "../CONSTANTS";
import { useSushiGo } from "../contexts/SushiGoContext";
import useLogout from "../hooks/useLogout";
import classNames from "classnames";

const UserInfo = () => {
	const { user } = useSushiGo();
	const logout = useLogout();

	return (
		<div className={classNames({
			"user-info-container": true,
			hidden: user.id === undefined
		})}>
			{user.id && 
				<img 
					src={`${SERVER_URI}/images/profiles/${user.id}`} 
					alt={user.id}
				/>
			}
			{user.username}
			<button
				onClick={async () => {
					await logout();
				}}
			>
				Log out
			</button>
		</div>
	);
}

export default UserInfo;