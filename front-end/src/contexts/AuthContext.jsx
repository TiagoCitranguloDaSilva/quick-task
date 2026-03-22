import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const AuthContext = createContext();

function setCookie(name, value, maxAgeSeconds) {
  if (value == null) {
    document.cookie = `token=${name}; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // When accessToken changes

    // If has no token or is loggin out
    if (accessToken == null) {
      return;
    }

    setCookie("token", accessToken, 14400);
  }, [accessToken]);

  useEffect(() => {
    // Get cookie
    const cookieToken = getCookie("token");

    // If user is trying to access login an register pages AND User has a token in storage
    if ((location.pathname == "/login" || location.pathname == "/register") && cookieToken) {
      navigate("/");
      return;
    } else if (location.pathname != "/login" && location.pathname != "/register" && !cookieToken) {
      // If user is trying to access other pages other than login an register AND User has no token in storage
      navigate("/login");
      return;
    }

    // If the stored cookie token is the same as session token
    if (cookieToken !== accessToken) {
      // This avoids the synchronous setState warning
      Promise.resolve().then(() => setAccessToken(cookieToken));
    }
  }, [location.pathname, navigate, accessToken]);

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

  async function register({ username, email, password }) {
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    // If response is an error, other than 200's codes
    if (!response.ok) throw new Error("Register failed");

    const token = await response.text();
    setAccessToken(token);
    return;
  }

  function logout() {
    setAccessToken(null);
    setCookie("token", null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
