import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate, Outlet } from "react-router";

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
  const [ready, setReady] = useState(false);
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

    // If the stored cookie token is the same as session token
    if (cookieToken !== accessToken) {
      // This avoids the synchronous setState warning
      Promise.resolve().then(() => {
        setAccessToken(cookieToken);
        setReady(true);
      });
    } else {
      setReady(true);
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
    if (!response.ok) {
      if (response.status == 400) {
        const content = await response.json();

        let userInvalid = [];

        content.errors.forEach((error) => {
          userInvalid.push({
            field: error.field,
            message: error.defaultMessage,
          });
        });

        return {
          success: false,
          status: response.status,
          invalids: userInvalid,
        };
      }

      if (response.status == 401) {
        const message = await response.text();

        return {
          success: false,
          status: response.status,
          message: message,
        };
      }

      throw new Error("Register failed");
    }

    const token = await response.text();
    setAccessToken(token);
    return { success: true };
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
    if (!response.ok) {
      if (response.status == 400) {
        const content = await response.json();

        let userInvalid = [];

        content.errors.forEach((error) => {
          userInvalid.push({
            field: error.field,
            message: error.defaultMessage,
          });
        });

        return {
          success: false,
          status: response.status,
          invalids: userInvalid,
        };
      } else if (response.status == 409) {
        const message = await response.text();

        return {
          success: false,
          status: response.status,
          message: message,
        };
      }

      throw new Error("Register failed");
    }

    return { success: true };
  }

  function logout() {
    setAccessToken(null);
    setCookie("token", null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout, register, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

// Route with auth required
export function ProtectedRoute() {
  // If has token -> Render the component ELSE Redirect
  return getCookie("token") ? <Outlet /> : <Navigate to="/login" />;
}

// Route with auth not required, dont allow access to pages like login or register in this case
export function PublicRoute() {
  // If has token -> Redirect ELSE Render the component
  return getCookie("token") ? (
    <Navigate to="/" />
  ) : (
    <div className="login_register">
      <Outlet />
    </div>
  );
}

export { AuthContext, AuthProvider };
