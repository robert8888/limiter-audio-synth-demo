import {Link} from "react-router-dom";
import "./menu.scss";

export default function Menu({items = [], className}){

    return (
        <nav className={"c-menu " + (className || "")}>
            <ul className="c-menu__list">
                {items.map((item, index) => 
                    <li className="c-menu__item" key={item.label + index}>
                        <Link className="c-menu__link" to={item.link}>{item.label}</Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}