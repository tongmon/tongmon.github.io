import classes from "../home/Header.module.css";
import profileImage from "../../assets/profile.jpg";

// ref: https://html5up.net/dimension

export function Header() {
  return (
    <header className={classes["welcome-header"]}>
      <div>
        <img src={profileImage} alt="tongstar's profile image" />
      </div>
      <div>
        <div>
          <h1>Welcome!</h1>
          <p>{"This is the blog of tongstar.\nFeel free to look around!"}</p>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#intro">Intro</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
