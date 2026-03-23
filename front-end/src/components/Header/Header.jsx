import { Link } from "react-router";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
          <h1>Quick Task</h1>
        </Link>

        <nav className={styles.buttons}>
          <button>Home</button>
          <button>Log in</button>
          <button>Register</button>
        </nav>
      </div>
    </header>
  );
}
