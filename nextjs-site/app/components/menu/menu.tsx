'use client';

import { useState, useEffect, MouseEventHandler } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { buildGarageName, getSavedGarages } from '../../../functions/storage';
import { eachCar } from '../../../functions/cars';
import { labelKey } from '../../../functions/url';

import menuStyles from './menu.module.scss';

const Menu = ({ i18nArray, lng }: { i18nArray: { [s: string]: string }; lng: string }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const searchParamsObject = Object.fromEntries(searchParams);

  const [ savedGarages, setSavedGarages ] = useState<any[]>([]);
  useEffect(() => {
    setSavedGarages(getSavedGarages());
  }, []);
  let garageMenuItems;
  if (savedGarages.length > 0) {
    const savedGarageLabel = i18nArray['components.menu.saved_garages'];
    const garageElements = [<div key="menu-label" className={menuStyles.menuLabel}>{ savedGarageLabel }</div>];

    savedGarages.forEach(garage => {
      const garageName = buildGarageName(garage);
      const garageParams: any = {};
      eachCar((carKey: string, idx: number) => {
        if (garage[idx]) {
          garageParams[carKey] = garage[idx].id;
          garageParams[labelKey(carKey)] = garage[idx].label;
        }
      });
      const onClick = ((e) => {
        e.preventDefault();
        toggleMenu();
        replace(`/${lng}?${qs.stringify({...garageParams})}`);
      }) as MouseEventHandler;
      garageElements.push((
        <li key={garageName} className={menuStyles.menuItem}>
          <Link onClick={onClick} href="" className={menuStyles.menuLink}>{garageName}</Link>
        </li>
      ));
    });

    garageMenuItems = (
      <>
        <Link onClick={toggleMenu} href={{ pathname: `/${lng}`, query: { ...searchParamsObject } }} className={menuStyles.menuLink}>
          { i18nArray['components.menu.garages'] }
        </Link>
        <ul className={menuStyles.menuSublist}>
          <li className={menuStyles.menuItem}>
            <Link onClick={toggleMenu} href={{ pathname: `/${lng}`, query: { ...searchParamsObject } }} className={menuStyles.menuLink}>
              { i18nArray['components.menu.current_garage'] }
            </Link>
          </li>
          { garageElements }
        </ul>
      </>
    );
  } else {
    garageMenuItems = (
      <Link onClick={toggleMenu} href={{ pathname: `/${lng}`, query: { ...searchParamsObject } }} className={menuStyles.menuLink}>
        { i18nArray['components.menu.the_garage'] }
      </Link>
    );
  }

  const menuButtonClass = [menuStyles.menuButton, 'icon-button'];
  if (showMenu) {
    menuButtonClass.push(menuStyles.menuExpanded);
  }

  return (
    <>
      <button
        type="button"
        className={menuButtonClass.join(' ')}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} className={menuStyles.menuButtonIcon} />
      </button>
      <motion.aside
        animate={showMenu ? "open" : "closed"}
        className={`${menuStyles.menuContainer} menu`}
        variants={{
          open: { opacity: 1, scale: '1' },
          closed: { opacity: 0, scale: '0' },
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ul className={menuStyles.menuList}>
          <li className={menuStyles.menuItem}>{garageMenuItems}</li>
          <li className={menuStyles.menuItem}>
            <Link onClick={toggleMenu} href={{ pathname: `/${lng}/cars`, query: { ...searchParamsObject } }} className={menuStyles.menuLink}>
              { i18nArray['components.menu.cars'] }
            </Link>
          </li>
          <li className={menuStyles.menuItem}>
            <Link onClick={toggleMenu} href={{ pathname: `/${lng}/about`, query: { ...searchParamsObject } }} className={menuStyles.menuLink}>{ i18nArray['components.menu.about'] }</Link>
          </li>
        </ul>
      </motion.aside>
      { showMenu && <div className="backdrop" onClick={toggleMenu}></div> }
    </>
  );
};

export default Menu;
