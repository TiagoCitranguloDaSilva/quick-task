import { createContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  async function login({ email, password }) {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // If response is an error, other than 200's codes
    if (!response.ok) throw new Error("Login failed");

    const token = await response.text();
    setAccessToken(token);
    return;
  }

  function logout() {
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
