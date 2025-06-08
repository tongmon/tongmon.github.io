import { Link } from "react-router-dom";

import classes from "../home/Home.module.css";
import profileImage from "/images/profile_pixelate.png";

export function Home() {
  return (
    <div className={classes["home-bg"]}>
      <header className={classes["home"]}>
        <img src={profileImage} alt="tongstar's profile image" />
        <h1>Welcome!</h1>
        <p>{"This is the blog of tongstar.\nFeel free to look around!"}</p>
        <nav>
          <ul>
            <li>
              <Link to="/Learn">Learn</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/Life">Life</Link>
            </li>
            <li>
              <Link to="/Work">Work</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/About">About</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
