import axios from "../api/axios";
import { useUser } from "../contexts/UserContext";

const useRefreshToken = () => {
	const { updateUser } = useUser();

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