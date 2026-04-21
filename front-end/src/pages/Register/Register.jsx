import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import ErrorMessage from "../../components/ErrorMessage";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [user, setUser] = useState({ username: "", email: "", password: "", passwordConfirm: "" });
  const [error, setError] = useState({
    username: { invalid: false, message: null },
    email: { invalid: false, message: null },
    password: { invalid: false, message: null },
    passwordConfirm: "",
    userAlreadyExists: false,
  });

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const invalid = {
      username: user.username.trim().length == 0,
      email: user.email.trim().length == 0,
      password: user.password.trim().length == 0,
      passwordConfirm: user.password != user.passwordConfirm,
    };

    setError({
      username: { invalid: false, message: null },
      email: { invalid: false, message: null },
      password: { invalid: false, message: null },
      passwordConfirm: false,
      userAlreadyExists: false,
    });

    if (invalid.username) {
      setError((prevError) => ({ ...prevError, username: { invalid: true, message: null } }));
    }

    if (invalid.email) {
      setError((prevError) => ({ ...prevError, email: { invalid: true, message: null } }));
    }

    if (invalid.password) {
      setError((prevError) => ({ ...prevError, password: { invalid: true, message: null } }));
    }

    if (invalid.passwordConfirm) {
      setError((prevError) => ({ ...prevError, passwordConfirm: true }));
    }

    // At least one is invalid, don't try to fetch yet
    if (invalid.username || invalid.email || invalid.password || invalid.passwordConfirm) {
      return;
    }

    let response = await register({
      username: user.username,
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

      // User exists
      if (response.status == 409) {
        setError((prevError) => ({ ...prevError, userAlreadyExists: true }));
      }

      return;
    }

    navigate("/login");
  }

  function handleUsernameInput(e) {
    setUser((prevUser) => ({ ...prevUser, username: e.target.value }));
  }

  function handleEmailInput(e) {
    setUser((prevUser) => ({ ...prevUser, email: e.target.value }));
  }

  function handlePasswordInput(e) {
    setUser((prevUser) => ({ ...prevUser, password: e.target.value }));
  }

  function handlePasswordConfirmInput(e) {
    setUser((prevUser) => ({ ...prevUser, passwordConfirm: e.target.value }));
  }

  return (
    <>
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form_group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleUsernameInput}
            value={user.username}
          />
          <ErrorMessage error={error.username} defaultMessage="Username required" />
        </div>

        <div className="form_group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
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

        <div className="form_group">
          <label htmlFor="password_confirmation">Confirm password</label>
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            onChange={handlePasswordConfirmInput}
            value={user.passwordConfirm}
          />
          <ErrorMessage error={error.passwordConfirm} message="Passwords must match" />
        </div>

        <ErrorMessage error={error.userAlreadyExists} message="User already exists" />

        <button>Sign up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  );
}
