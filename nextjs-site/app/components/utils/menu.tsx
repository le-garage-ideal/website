import { Dispatch, SetStateAction, useContext } from 'react';
import { useTranslation,  } from 'next-i18next';
import qs from 'qs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { buildGarageName, getSavedGarages } from '../../../functions/storage';
import { CarsContext, eachCar } from '../../../functions/cars';
import { labelKey } from '../../../functions/url';
import menuStyles from './menu.module.scss';
import { Car as CarsType } from '../../../types/car';

const Menu = ({ uri }: { uri: string | undefined }) => {
  const { t: i18n } = useTranslation();
  const languageParam = i18n.language;
  const setCars = useContext(CarsContext)[1] as unknown as Dispatch<SetStateAction<CarsType>>;

  const { push, query } = useRouter();

  const savedGarages = getSavedGarages();
  let garageMenuItems;
  if (savedGarages.length > 0) {
    const savedGarageLabel = i18n('components.menu.saved_garages');
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
        setCars(garage);
        push(`?${qs.stringify({...languageParam, ...garageParams})}`);
      }
      garageElements.push((
        <li key={garageName}>
          <Link href="#" onClick={onClick}>{garageName}</Link>
        </li>
      ));
    });

    garageMenuItems = (
      <>
        <Link href={{ pathname: '/', query: { ...query, ...languageParam } }}>{ i18n('components.menu.garages') }</Link>
        <ul>
          <li><Link href={{ pathname: '/', query: { ...query, ...languageParam } }}>{ i18n('components.menu.current_garage') }</Link></li>
          { garageElements }
        </ul>
      </>
    );
  } else {
    garageMenuItems = <Link href={{ pathname: '/', query: { ...query, ...languageParam } }}>{ i18n('components.menu.the_garage') }</Link>;
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
        <li>
          <Link href={{ pathname: '/cars', query: { ...query, ...languageParam } }}>
            { i18n('components.menu.cars') }
          </Link>
        </li>
        <li><Link href={{ pathname: '/about', query: { ...query, ...languageParam } }}>{ i18n('components.menu.about') }</Link></li>
      </ul>
    </motion.aside>
  );
};

export default Menu;
