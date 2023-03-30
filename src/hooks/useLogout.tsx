import axios from "../api/axios";
import { useSushiGo } from "../contexts/SushiGoContext";

const useLogout = () => {
	const { clearUser } = useSushiGo();

	const logout = async () => {
		clearUser({});
		try {
			await axios('/logout', {
				withCredentials: true
			});
		} catch (err) {
			console.error(err);
		} finally {
			localStorage.setItem('persist', 'false');
		}
	};

	return logout;
}

export default useLogout;