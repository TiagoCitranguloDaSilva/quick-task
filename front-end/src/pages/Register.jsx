import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [user, setUser] = useState({ username: "", email: "", password: "", passwordConfirm: "" });
  const [error, setError] = useState({
    username: false,
    email: false,
    password: false,
    passwordConfirm: "",
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

    setError({ username: false, email: false, password: false, passwordConfirm: false });

    if (invalid.username) {
      setError((prevError) => ({ ...prevError, username: true }));
    }

    if (invalid.email) {
      setError((prevError) => ({ ...prevError, email: true }));
    }

    if (invalid.password) {
      setError((prevError) => ({ ...prevError, password: true }));
    }

    if (invalid.passwordConfirm) {
      setError((prevError) => ({ ...prevError, passwordConfirm: true }));
    }

    // At least one is invalid, don't try to fetch yet
    if (invalid.username || invalid.email || invalid.password || invalid.passwordConfirm) {
      return;
    }

    console.log("will register");
    await register({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    console.log("will login");

    navigate("/");
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleUsernameInput}
          value={user.username}
        />
        {error.username == true ? <p>Your username should have at least 1 character</p> : null}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleEmailInput}
          value={user.email}
        />
        {error.email == true ? <p>Your email should have at least 1 character</p> : null}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handlePasswordInput}
          value={user.password}
        />
        {error.password == true ? <p>Your password should have at least 1 character</p> : null}
      </div>

      <div>
        <label htmlFor="password_confirmation">Confirm password</label>
        <input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          onChange={handlePasswordConfirmInput}
          value={user.passwordConfirm}
        />
        {error.passwordConfirm == true ? <p>Your password should match</p> : null}
      </div>

      <button>Sign up</button>
    </form>
  );
}
