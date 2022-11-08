const AUTH_STATE_KEY = "authState";

export const storeAuthData = (authState) => {
  localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
};

export const getAuthData = () => {
  const authState = localStorage.getItem(AUTH_STATE_KEY);

  if (authState) {
    return JSON.parse(authState);
  }

  return null;
};
