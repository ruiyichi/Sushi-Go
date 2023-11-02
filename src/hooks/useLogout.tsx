import axios from "../api/axios";
import { useUser } from "../contexts/UserContext";

const useLogout = () => {
	const { clearUser } = useUser();

	const logout = async () => {
		clearUser({});
		try {
			await axios('/logout', {
				withCredentials: true
			});
		} catch (err) {
			console.error(err);
		}
	};

	return logout;
}

export default useLogout;