import classes from "../home/Header.module.css";
import profileImage from "../../assets/profile_pixelate.png";

// ref: https://html5up.net/dimension

export function Header() {
  return (
    <header className={classes["welcome-header"]}>
      <img src={profileImage} alt="tongstar's profile image" />
      <h1>Welcome!</h1>
      <p>{"This is the blog of tongstar.\nFeel free to look around!"}</p>
      <nav>
        <ul>
          <li>
            <a href="#learn">Learn</a>
          </li>
          <li>
            <a href="#life">Life</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
