import { Link } from 'react-router-dom';

import classes from "../learn/Learn.module.css";

export function Learn() {
    return (
        <div className={classes["learn-bg"]}>
            <div className={classes["category-menu"]}>
                <h1>Learn</h1>
                <h1>Search bar</h1>
                <div className={classes["dropdown"]}>
                    <button className={classes["dropbtn"]}>Programming</button>
                    <div className={classes["dropdown-content"]}>
                        <li><Link to="/learn/menu2/text1">text1</Link></li>
                        <li><Link to="/learn/menu2/text2">text2</Link></li>
                        <li><Link to="/learn/menu2/text3">text3</Link></li>
                    </div>
                </div>
                <ul>
                    <li>
                        <Link to="/learn/menu2">menu2</Link>
                        <ul>
                            <li><Link to="/learn/menu2/text1">text1</Link></li>
                            <li><Link to="/learn/menu2/text2">text2</Link></li>
                            <li><Link to="/learn/menu2/text3">text3</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div className={classes["content-grid"]}>2</div>
        </div>
    );
}
