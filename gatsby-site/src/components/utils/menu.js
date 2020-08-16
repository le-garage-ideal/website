
import React from "react";
import menuStyles from './menu.module.scss';
import { motion } from 'framer-motion';
const Menu = () => {

    return (
        <motion.aside className={menuStyles.menuContainer + ' menu'}
            initial={{scale: '0%'}} animate={{scale:'100%'}} transition={{ ease: "easeInOut", duration: 0.2 }}>
            <ul className="menu-list">
                <li><a href="/">Le Garage</a></li>
                <li><a href="/cars">Les Voitures</a></li>
                <li><a href="/about">A propos du site</a></li>
            </ul>
        </motion.aside>
    );
};

export default Menu;