import React from 'react';
import PropTypes from 'prop-types';
import Uri from 'jsuri';
import { motion } from 'framer-motion';
import { useIntl } from 'gatsby-plugin-intl';
import { eachCar } from '../../functions/cars';
import menuStyles from './menu.module.scss';

const Menu = ({ uri }) => {
  const intl = useIntl();

  const uriObj = new Uri(uri);
  const carsUri = uriObj.setPath('/cars').toString();
  const aboutUri = uriObj.setPath('/about').toString();

  const garageUri = uriObj.setPath('/').toString();

  let garageMenuItem;
  if (localStorage.length > 0) {
    const savedGarageLabel = intl.formatMessage({ id: 'components.menu.saved_garages' });
    const garageElements = [<p key="menu-label" className="menu-label">{ savedGarageLabel }</p>];
    for (let i = 0; i < localStorage.length; i += 1) {
      const savedGarageUri = new Uri(garageUri);
      const garageName = localStorage.key(i);
      if (garageName !== 'gatsby-intl-language') {
        const garage = JSON.parse(localStorage.getItem(garageName));
        eachCar((paramName, idx) => savedGarageUri.replaceQueryParam(paramName, garage[idx].mongodb_id));
        garageElements.push(<li key={garageName}><a href={savedGarageUri.toString()}>{garageName}</a></li>);
      }
    }
    garageMenuItem = (
      <>
        <a href={garageUri}>{ intl.formatMessage({ id: 'components.menu.garages' }) }</a>
        <ul>
          <li><a href={garageUri}>{ intl.formatMessage({ id: 'components.menu.current_garage' }) }</a></li>
          { garageElements }
        </ul>
      </>
    );
  } else {
    garageMenuItem = <a href={garageUri}>{ intl.formatMessage({ id: 'components.menu.the_garage' }) }</a>;
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
        <li><a href={carsUri}>{ intl.formatMessage({ id: 'components.menu.cars' }) }</a></li>
        <li><a href={aboutUri}>{ intl.formatMessage({ id: 'components.menu.about' }) }</a></li>
      </ul>
    </motion.aside>
  );
};

Menu.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default Menu;
