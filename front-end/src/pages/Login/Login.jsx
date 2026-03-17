import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router";

function Login() {
  const { login } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: false, password: false });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const invalid = {
      email: user.email.trim().length == 0,
      password: user.password.trim().length == 0,
    };

    setError({ email: false, password: false });

    if (invalid.email) {
      setError((prevError) => ({ ...prevError, email: true }));
    }

    if (invalid.password) {
      setError((prevError) => ({ ...prevError, password: true }));
    }

    // At least one is invalid, don't try to fetch yet
    if (invalid.email || invalid.password) {
      return;
    }

    await login({
      email: user.email,
      password: user.password,
    });
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleEmailInput}
            value={user.email}
          />
          {error.email == true ? <p>Email required</p> : null}
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
          {error.password == true ? <p>Password required</p> : null}
        </div>

        <button>Log in</button>
      </form>{" "}
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </>
  );
}

export default Login;
