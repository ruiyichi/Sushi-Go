import axios from "../api/axios";
import { useSushiGo } from "../contexts/SushiGoContext";

const useRefreshToken = () => {
	const { updateUser } = useSushiGo();

	const refresh = async () => {
		const response = await axios.get('/refresh', {
			withCredentials: true
		});

		updateUser(response.data);
		return response.data.accessToken;
	}

	return refresh;
}

export default useRefreshToken;