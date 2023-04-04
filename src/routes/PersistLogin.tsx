import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useSushiGo } from "../contexts/SushiGoContext";
import Loading from "../components/Loading";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, persist } = useSushiGo();
  const refresh = useRefreshToken();

  useEffect(() => {
		localStorage.setItem('persist', persist);
	}, [persist]);

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

    persist && !user?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return (
    <>
      {!persist
        ? <Outlet /> 
        : isLoading
          ? <Loading />
          : <Outlet />
      }
    </>
  );
}

export default PersistLogin;