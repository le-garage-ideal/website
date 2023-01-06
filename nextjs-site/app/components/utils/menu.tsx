import React, { Dispatch, SetStateAction, useContext } from 'react';

import Uri from 'jsuri';
import { motion } from 'framer-motion';
import { buildGarageName, getSavedGarages } from '../../../functions/storage';
import { CarsContext, eachCar } from '../../../functions/cars';
import { extractRelativePathWithParams } from '../../../functions/url';
import menuStyles from './menu.module.scss';
import { I18nContext } from '../../../functions/i18n';
import Link from 'next/link';
import { Car } from '../../../types/car';
import { useRouter } from 'next/router';

const Menu = ({ uri }: { uri: string }) => {
  const i18n = useContext(I18nContext);
  const setCars = useContext(CarsContext)[1] as Dispatch<SetStateAction<(Car | undefined)[]>>;

  const { push } = useRouter();

  const uriObj = new Uri(uri);
  const carsUri = extractRelativePathWithParams(uriObj.setPath('/cars'));
  const aboutUri = extractRelativePathWithParams(uriObj.setPath('/about'));

  const garageUri = extractRelativePathWithParams(uriObj.setPath('/'));

  const savedGarages = getSavedGarages();
  let garageMenuItems;
  if (savedGarages.length > 0) {
    const savedGarageLabel = i18n['components.menu.saved_garages'];
    const garageElements = [<p key="menu-label" className="menu-label">{ savedGarageLabel }</p>];

    const savedGarageUri = new Uri(garageUri);
    savedGarages.forEach(garage => {
      const garageName = buildGarageName(garage);
      eachCar((carKey: string, idx: number) => {
        if (garage[idx]) {
          savedGarageUri.replaceQueryParam(carKey, garage[idx].id);
        }
      });
      const onClick = () => {
        setCars(garage);
        push(extractRelativePathWithParams(savedGarageUri));
      }
      garageElements.push(<li key={garageName}><a href="#" onClick={onClick}>{garageName}</a></li>);
    });

    garageMenuItems = (
      <>
        <Link href={garageUri}>{ i18n['components.menu.garages'] }</Link>
        <ul>
          <li><Link href={garageUri}>{ i18n['components.menu.current_garage'] }</Link></li>
          { garageElements }
        </ul>
      </>
    );
  } else {
    garageMenuItems = <Link href={garageUri}>{ i18n['components.menu.the_garage'] }</Link>;
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
        <li><Link href={carsUri}>{ i18n['components.menu.cars'] }</Link></li>
        <li><Link href={aboutUri}>{ i18n['components.menu.about'] }</Link></li>
      </ul>
    </motion.aside>
  );
};

export default Menu;
