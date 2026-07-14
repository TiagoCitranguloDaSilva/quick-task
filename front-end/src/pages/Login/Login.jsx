import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

import ErrorMessage from "../../components/ErrorMessage";

function Login() {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({
    email: { invalid: false, message: null },
    password: { invalid: false, message: null },
    incorrectCredentials: false,
    serverError: false,
  });
  const navigate = useNavigate();

  function validateInput(key, named) {
    let selected = user[key];
    let invalid = true;
    let message = null;

    if (selected == null) return;

    let value = selected.trim();

    if (value.length == 0) {
      message = `${named} required`;
    } else if (value.length > 255) {
      message = `${named} must not exceed 255 characters`;
    } else {
      invalid = false;
    }

    setError((prevError) => ({ ...prevError, [key]: { invalid: invalid, message: message } }));
    return invalid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError({
      email: { invalid: false, message: null },
      password: { invalid: false, message: null },
      incorrectCredentials: false,
      serverError: false,
    });

    const invalid = {
      email: validateInput("email", "Email"),
      password: validateInput("password", "Password"),
    };

    // At least one is invalid, don't try to fetch yet
    if (invalid.email || invalid.password) {
      return;
    }

    let response = await login({
      email: user.email,
      password: user.password,
    });

    console.log(response);

    // If unsuccessful
    if (!response.success) {
      // Validation error
      if (response.status == 400) {
        const updateInvalids = response.invalids.reduce((invalids, current) => {
          invalids[current.field] = { invalid: true, message: current.message };
          return invalids;
        }, {});

        setError((prevError) => ({ ...prevError, ...updateInvalids }));
      }

      // Incorrect credentials
      if (response.status == 403) {
        setError((prevError) => ({ ...prevError, incorrectCredentials: true }));
      }

      // Service Unavailable, backend server is not accessible
      if (response.status == 503) {
        setError((prevError) => ({ ...prevError, serverError: true }));
      }

      return;
    }

    navigate("/");
  }

  function handleEmailInput(e) {
    setUser((prevUser) => ({ ...prevUser, email: e.target.value }));
  }

  function handlePasswordInput(e) {
    setUser((prevUser) => ({ ...prevUser, password: e.target.value }));
  }

  return (
    <>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form_group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={handleEmailInput}
            value={user.email}
          />
          <ErrorMessage error={error.email} defaultMessage="Email required" />
        </div>

        <div className="form_group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handlePasswordInput}
            value={user.password}
          />
          <ErrorMessage error={error.password} defaultMessage="Password required" />
        </div>

        <ErrorMessage error={error.incorrectCredentials} message="Incorrect credentials" />

        <ErrorMessage
          error={error.serverError}
          message="Server temporarily unavailable. Please try again later"
        />

        <button>Log in</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </>
  );
}

export default Login;
