import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useSushiGo } from "../contexts/SushiGoContext";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, persist } = useSushiGo();
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
      {!persist
        ? <Outlet /> 
        : isLoading
          ? <div>Loading...</div>
          : <Outlet />
      }
    </>
  );
}

export default PersistLogin;