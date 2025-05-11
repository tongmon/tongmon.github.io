import { useNavigate } from 'react-router-dom';

import classes from "../home/Home.module.css";
import profileImage from "/images/profile_pixelate.png";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className={classes["home-bg"]}>
      <header className={classes["home"]}>
        <img src={profileImage} alt="tongstar's profile image" />
        <h1>Welcome!</h1>
        <p>{"This is the blog of tongstar.\nFeel free to look around!"}</p>
        <nav>
          <ul>
            <li>
              <a href="learn" onClick={() => navigate('/')}>Learn</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#life">Life</a>
            </li>
            <li>
              <a href="#work">Work</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
