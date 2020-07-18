
import React from "react";
import menuStyles from './menu.module.scss';

const Menu = () => {

    return (
        <aside className={menuStyles.menuContainer + ' menu'}>
            <ul className="menu-list">
                <li><a href="/">Le Garage</a></li>
                <li><a href="/cars">Les Voitures</a></li>
                <li><a href="/about">A propos du site</a></li>
            </ul>
        </aside>
    );
};

export default Menu;