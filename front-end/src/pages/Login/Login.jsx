import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router";

import styles from "./Login.module.css";
import ErrorMessage from "../../components/ErrorMessage";

function Login() {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({
    email: { invalid: false, message: null },
    password: { invalid: false, message: null },
    incorrectCredentials: false,
  });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const invalid = {
      email: user.email.trim().length == 0,
      password: user.password.trim().length == 0,
    };

    setError({
      email: { invalid: false, message: null },
      password: { invalid: false, message: null },
      incorrectCredentials: false,
    });

    if (invalid.email) {
      setError((prevError) => ({ ...prevError, email: { invalid: true, message: null } }));
    }

    if (invalid.password) {
      setError((prevError) => ({ ...prevError, password: { invalid: true, message: null } }));
    }

    // At least one is invalid, don't try to fetch yet
    if (invalid.email || invalid.password) {
      return;
    }

    let response = await login({
      email: user.email,
      password: user.password,
    });

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

      //Incorrect credentials
      if (response.status == 401) {
        setError((prevError) => ({ ...prevError, incorrectCredentials: true }));
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form_group}>
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

        <div className={styles.form_group}>
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

        <button>Log in</button>
      </form>{" "}
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </>
  );
}

export default Login;
