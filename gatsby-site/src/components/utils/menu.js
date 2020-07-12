
import React from "react";
import menuStyles from './menu.module.scss';

const Menu = () => {

    return (
        <aside className={menuStyles.menuContainer + ' menu'}>
            <ul className="menu-list">
                <li><a href="/">Sauvegarde et partage</a></li>
                <li><a href="/">Garage club</a></li>
                <li><a href="/">Voitures</a></li>
                <li><a href="/">Contact</a></li>
                <li><a href="/">A propos</a></li>
                <li><a href="/">Mentions obligatoires</a></li>
            </ul>
        </aside>
    );
};

export default Menu;