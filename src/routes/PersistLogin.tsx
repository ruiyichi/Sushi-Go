import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import Loading from "../components/Loading";
import { useUser } from "../contexts/UserContext";

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { user } = useUser();
	const refresh = useRefreshToken();

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			}
			catch (err) {
				console.log(err);
			}
			finally {
				setIsLoading(false);
			}
		}

		!user?.accessToken ? verifyRefreshToken() : setIsLoading(false);
	}, []);

	return (
		<>
			{isLoading
				? <Loading />
				: <Outlet />
			}
		</>
	);
}

export default PersistLogin;