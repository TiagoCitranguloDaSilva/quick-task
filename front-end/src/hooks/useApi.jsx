import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useApi() {
  const { accessToken, logout } = useContext(AuthContext);

  async function fetchWithAuth(url, optionsPassed = {}) {
    const options = {
      method: optionsPassed.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(optionsPassed.headers || {}),
      },
      body: optionsPassed.body,
    };

    // If has a token, pass it
    if (accessToken) options.headers.Authorization = `Bearer ${accessToken}`;

    const response = await fetch(url, options);

    if (response.status == 401) {
      // token invalid or expired, need to re login
      logout();
      throw new Error("Unauthorized - need to log in again");
    }

    return response;
  }

  return { fetchWithAuth };
}
