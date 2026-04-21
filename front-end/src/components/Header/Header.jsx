import { Link, NavLink, useNavigate } from "react-router";
import styles from "./Header.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    let fontSize = parseFloat(getComputedStyle(document.body).fontSize);

    function handleResize() {
      fontSize = parseFloat(getComputedStyle(document.body).fontSize);
    }

    function handleScroll() {
      if (window.scrollY > fontSize * 1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className={styles.header} data-scrolled={scrolled}>
      <div className={styles.header_effect_color}></div>
      <div className={styles.header_effect_mask}></div>

      <div className={styles.header_sub}>
        <Link className={styles.logo_and_text} to="/" data-no-default="true">
          <img
            className={styles.logo}
            src={`${import.meta.env.BASE_URL}assets/icons/logo-light.svg`}
            alt=""
          />
          <p className={styles.logo_text}>Quick Task</p>
        </Link>

        <nav className={styles.buttons}>
          {accessToken == null ? (
            // No token = no login
            <>
              <NavLink className="button" data-no-default="true" to="/login">
                Log in
              </NavLink>
              <NavLink className="button" data-no-default="true" to="/register">
                Sign up
              </NavLink>
            </>
          ) : (
            // Has token = logged in
            <>
              <NavLink className="button" data-no-default="true" to="/">
                Home
              </NavLink>
              <button onClick={handleLogout}>Log out</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
