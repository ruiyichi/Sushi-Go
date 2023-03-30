import axios from "../api/axios";
import { useSushiGo } from "../contexts/SushiGoContext";

const useRefreshToken = () => {
  const { updateUser } = useSushiGo();

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true
    });

    const { accessToken } = response.data;

    updateUser({ accessToken });
    return accessToken;
  }

  return refresh;
}

export default useRefreshToken();