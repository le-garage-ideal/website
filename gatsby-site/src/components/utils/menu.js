import React from 'react';
import PropTypes from 'prop-types';
import Uri from 'jsuri';
import { motion } from 'framer-motion';
import { eachCar } from '../../functions/cars';
import menuStyles from './menu.module.scss';

const Menu = ({ uri }) => {
  const uriObj = new Uri(uri);
  const carsUri = uriObj.setPath('/cars').toString();
  const aboutUri = uriObj.setPath('/about').toString();

  const garageUri = uriObj.setPath('/').toString();

  let garageMenuItem;
  if (localStorage.length > 0) {
    const garageElements = [<p key="menu-label" className="menu-label">Garages sauvegardés</p>];
    for (let i = 0; i < localStorage.length; i += 1) {
      const savedGarageUri = new Uri(garageUri);
      const garageName = localStorage.key(i);
      const garage = JSON.parse(localStorage.getItem(garageName));
      eachCar((paramName, idx) => savedGarageUri.replaceQueryParam(paramName, garage[idx].mongodb_id));
      garageElements.push(<li key={garageName}><a href={savedGarageUri.toString()}>{garageName}</a></li>);
    }
    garageMenuItem = (
      <>
        <a href={garageUri}>Les Garages</a>
        <ul>
          <li><a href={garageUri}>Garage en cours</a></li>
          { garageElements }
        </ul>
      </>
    );
  } else {
    garageMenuItem = <a href={garageUri}>Le Garage</a>;
  }

  return (
    <motion.aside
      className={`${menuStyles.menuContainer} menu`}
      initial={{ scale: '0%' }}
      animate={{ scale: '100%' }}
      transition={{ ease: 'easeInOut', duration: 0.1 }}
    >
      <ul className="menu-list">
        <li>{garageMenuItem}</li>
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
