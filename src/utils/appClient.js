import { getValidAccessToken } from "./authService";

export const authFetch = async (url, options = {}) => {
  const token = await getValidAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};