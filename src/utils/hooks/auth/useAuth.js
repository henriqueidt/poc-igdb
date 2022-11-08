import { useCallback, useEffect, useState } from "react";
import { getAuthData, storeAuthData } from "./authStorage";

const addTimeToCurrentDate = (time) => {
  const date = new Date();
  const milliseconds = date.getMilliseconds();
  date.setMilliseconds(milliseconds + time);
  return date;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState(getAuthData());

  const isTokenExpired = useCallback(() => {
    return new Date(authState.expiration).getTime() < new Date().getTime();
  }, [authState]);

  useEffect(() => {
    if (!authState || isTokenExpired()) {
      login();
    }
  }, [authState, isTokenExpired]);

  const login = async () => {
    try {
      const authData = await fetch(
        "https://id.twitch.tv/oauth2/token?client_id=z6eg9t0uabn96tvt7l8yibmaff8n0w&client_secret=7wenmu85erti1niritenv3s92pgbs3&grant_type=client_credentials",
        {
          method: "POST",
        }
      );

      const auth = await authData.json();
      const authDataWithExpiration = {
        ...auth,
        expiration: addTimeToCurrentDate(auth.expires_in),
      };
      setAuthState(authDataWithExpiration);
      storeAuthData(authDataWithExpiration);
    } catch (error) {
      console.log(error);
    }
  };
  return { authState };
};
