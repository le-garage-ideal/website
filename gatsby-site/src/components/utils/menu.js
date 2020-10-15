import React from 'react';
import PropTypes from 'prop-types';
import Uri from 'jsuri';
import { motion } from 'framer-motion';
import menuStyles from './menu.module.scss';

const Menu = ({ uri }) => {
  const uriObj = new Uri(uri);
  const garageUri = uriObj.setPath('/').toString();
  const carsUri = uriObj.setPath('/cars').toString();
  const aboutUri = uriObj.setPath('/about').toString();
  return (
    <motion.aside
      className={`${menuStyles.menuContainer} menu`}
      initial={{ scale: '0%' }}
      animate={{ scale: '100%' }}
      transition={{ ease: 'easeInOut', duration: 0.1 }}
    >
      <ul className="menu-list">
        <li><a href={garageUri}>Le Garage</a></li>
        <li><a href={carsUri}>Les Voitures</a></li>
        <li><a href={aboutUri}>A propos du site</a></li>
      </ul>
    </motion.aside>
  );
};

Menu.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default Menu;
