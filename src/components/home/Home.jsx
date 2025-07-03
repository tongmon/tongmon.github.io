import { Link } from "react-router-dom";

import classes from "./Home.module.css";
import profileImage from "../../assets/images/profile_pixelate_org.png";

import { PostDataManager } from "../util/PostDataManager";

// ref: https://dev.to/pixmy/animated-arcade-with-pure-css-5hn1
// ref: https://pixelcorners.lukeb.co.uk/?radius=8&multiplier=5
// ref: https://inpa.tistory.com/entry/CSS-%F0%9F%93%9A-%ED%94%8C%EB%9E%99%EC%8A%A4Flex-%F0%9F%92%AF-%EC%B4%9D%EC%A0%95%EB%A6%AC
// ref: https://velog.io/@cdw8431/2025%EB%85%84-%EC%9D%B4%EC%A7%81-%ED%9A%8C%EA%B3%A0-%EC%88%A8%EA%B3%A0-%EC%B5%9C%EC%A2%85%ED%95%A9%EA%B2%A9

export function Home() {
  let postDataManager = new PostDataManager();
  console.log("PostTree: ", postDataManager.getPostTree());
  console.log("CategorizedPosts: ", postDataManager.getCategorizedPosts());

  return (
    <div className={classes["home-bg"]}>
      <header className={classes["home"]}>
        <img src={profileImage} alt="tongstar's profile image" />
        <h1>Welcome!</h1>
        <p>{"This is the blog of tongstar.\nFeel free to look around!"}</p>
        <nav>
          <ul>
            <li>
              <Link to="/Learn/All">Learn</Link>
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
