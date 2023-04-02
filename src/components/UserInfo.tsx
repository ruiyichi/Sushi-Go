import { useSushiGo } from "../contexts/SushiGoContext";
import useLogout from "../hooks/useLogout";
import classNames from "classnames";

const UserInfo = () => {
	const { user } = useSushiGo();
	const logout = useLogout();

	return (
		<div className={classNames({
			"user-info-container": true,
			hidden: user.username === undefined
		})}>
			Logged in as: { user.username }
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