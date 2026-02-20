
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();
const ACCESS_COOKIE = "jwt_authentication";
const REFRESH_KEY = "refresh";


export const saveAccessToken = (accessToken) => {
  const decoded = jwtDecode(accessToken);

  cookies.set(ACCESS_COOKIE, accessToken, {
    path: "/",
    expires: new Date(decoded.exp * 1000),
  });
};

export const getAccessToken = () => {
  return cookies.get(ACCESS_COOKIE);
};


export const clearTokens = () => {
  cookies.remove(ACCESS_COOKIE, { path: "/" });
  localStorage.removeItem(REFRESH_KEY);
};


export const refreshAccessToken = async () => {
  try {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) return null;

    const response = await fetch(
      "https://yeswanthm.pythonanywhere.com/api/auth/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      clearTokens();
      window.location.href = "/";
      return null;
    }

    saveAccessToken(data.access);
    return data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    window.location.href = "/";
    return null;
  }
};


export const getValidAccessToken = async () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);


    if (decoded.exp * 1000 < Date.now()) {
      return await refreshAccessToken();
    }

    return token;
  } catch {
    return await refreshAccessToken();
  }
};