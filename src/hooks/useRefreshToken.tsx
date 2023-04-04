import axios from "../api/axios";
import { useSushiGo } from "../contexts/SushiGoContext";

const useRefreshToken = () => {
	const { updateUser } = useSushiGo();

	const refresh = async () => {
		const response = await axios.get('/refresh', {
			withCredentials: true
		});

		const { accessToken, username } = response.data;

		updateUser({ accessToken, username });
		return accessToken;
	}

	return refresh;
}

export default useRefreshToken;