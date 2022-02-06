import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Uri from 'jsuri';
import { motion } from 'framer-motion';
import { useIntl, Link, navigate } from 'gatsby-plugin-react-intl';
import { buildGarageName, getSavedGarages } from '../../functions/storage';
import { CarsContext, eachCar } from '../../functions/cars';
import { extractRelativePathWithParams } from '../../functions/url';
import * as menuStyles from './menu.module.scss';

const Menu = ({ uri }) => {
  const intl = useIntl();
  const setCars = useContext(CarsContext)[1];

  const uriObj = new Uri(uri);
  const carsUri = extractRelativePathWithParams(uriObj.setPath('/cars'));
  const aboutUri = extractRelativePathWithParams(uriObj.setPath('/about'));

  const garageUri = extractRelativePathWithParams(uriObj.setPath('/'));

  const savedGarages = getSavedGarages();
  let garageMenuItems;
  if (savedGarages.length > 0) {
    const savedGarageLabel = intl.formatMessage({ id: 'components.menu.saved_garages' });
    const garageElements = [<p key="menu-label" className="menu-label">{ savedGarageLabel }</p>];

    const savedGarageUri = new Uri(garageUri);
    savedGarages.forEach(garage => {
      const garageName = buildGarageName(garage);
      eachCar((carKey, idx) => {
        if (garage[idx]) {
          savedGarageUri.replaceQueryParam(carKey, garage[idx].mongodb_id);
        }
      });
      const onClick = () => {
        setCars(garage);
        navigate(extractRelativePathWithParams(savedGarageUri));
      }
      garageElements.push(<li key={garageName}><a href="#" onClick={onClick}>{garageName}</a></li>);
    });

    garageMenuItems = (
      <>
        <Link to={garageUri}>{ intl.formatMessage({ id: 'components.menu.garages' }) }</Link>
        <ul>
          <li><Link to={garageUri}>{ intl.formatMessage({ id: 'components.menu.current_garage' }) }</Link></li>
          { garageElements }
        </ul>
      </>
    );
  } else {
    garageMenuItems = <Link to={garageUri}>{ intl.formatMessage({ id: 'components.menu.the_garage' }) }</Link>;
  }

  return (
    <motion.aside
      className={`${menuStyles.menuContainer} menu`}
      initial={{ scale: '0%' }}
      animate={{ scale: '100%' }}
      transition={{ ease: 'easeInOut', duration: 0.1 }}
    >
      <ul className="menu-list">
        <li>{garageMenuItems}</li>
        <li><Link to={carsUri}>{ intl.formatMessage({ id: 'components.menu.cars' }) }</Link></li>
        <li><Link to={aboutUri}>{ intl.formatMessage({ id: 'components.menu.about' }) }</Link></li>
      </ul>
    </motion.aside>
  );
};

Menu.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default Menu;
