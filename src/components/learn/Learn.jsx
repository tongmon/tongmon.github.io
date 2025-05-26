import { Link } from 'react-router-dom';

import classes from "../learn/Learn.module.css";

export function Learn() {
    return (
        <div className={classes["learn-bg"]}>
            <div className={classes["category-menu"]}>
                <div className={classes["title-box"]}>
                    <h1>Menu-Icon</h1>
                    <h1>Learn</h1>
                </div>
                <h1>Search bar</h1>
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
