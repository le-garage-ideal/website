'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import qs from 'qs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { buildGarageName, getSavedGarages } from '../../../functions/storage';
import { eachCar } from '../../../functions/cars';
import { labelKey } from '../../../functions/url';

import menuStyles from './menu.module.scss';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Menu = ({ i18n }: { i18n: { [s: string]: string } }) => {
  const [showMenu, setShowMenu] = useState(false);

  const { replace } = useRouter();
  const query = {};

  const [ savedGarages, setSavedGarages ] = useState<any[]>([]);
  useEffect(() => {
    setSavedGarages(getSavedGarages());
  }, []);
  let garageMenuItems;
  if (savedGarages.length > 0) {
    const savedGarageLabel = i18n['components.menu.saved_garages'];
    const garageElements = [<div key="menu-label" className="menu-label">{ savedGarageLabel }</div>];

    savedGarages.forEach(garage => {
      const garageName = buildGarageName(garage);
      const garageParams: any = {};
      eachCar((carKey: string, idx: number) => {
        if (garage[idx]) {
          garageParams[carKey] = garage[idx].id;
          garageParams[labelKey(carKey)] = garage[idx].label;
        }
      });
      const onClick = () => {
        replace(`?${qs.stringify({...garageParams})}`);
      }
      garageElements.push((
        <li key={garageName}>
          <Link href="#" onClick={onClick}>{garageName}</Link>
        </li>
      ));
    });

    garageMenuItems = (
      <>
        <Link href={{ pathname: '/', query: { ...query } }}>{ i18n['components.menu.garages'] }</Link>
        <ul>
          <li><Link href={{ pathname: '/', query: { ...query } }}>{ i18n['components.menu.current_garage'] }</Link></li>
          { garageElements }
        </ul>
      </>
    );
  } else {
    garageMenuItems = <Link href={{ pathname: '/', query: { ...query } }}>{ i18n['components.menu.the_garage'] }</Link>;
  }

  const menuButtonClass = [menuStyles.menuButton, 'icon-button'];
  if (showMenu) {
    menuButtonClass.push(menuStyles.menuExpanded);
  }

  return showMenu ? (
    <>
      <button type="button" className={menuButtonClass.join(' ')} onClick={() => setShowMenu(!showMenu)}>
        <FontAwesomeIcon icon={faBars} className={menuStyles.menuButtonIcon} />
      </button>
      <motion.aside
        className={`${menuStyles.menuContainer} menu`}
        initial={{ scale: '0%' }}
        animate={{ scale: '100%' }}
        transition={{ ease: 'easeInOut', duration: 0.1 }}
      >
        <ul className="menu-list">
          <li>{garageMenuItems}</li>
          <li>
            <Link href={{ pathname: '/cars', query: { ...query } }}>
              { i18n['components.menu.cars'] }
            </Link>
          </li>
          <li><Link href={{ pathname: '/about', query: { ...query } }}>{ i18n['components.menu.about'] }</Link></li>
        </ul>
      </motion.aside>
    </>
  ) : (
    <></>
  );
};

export default Menu;
