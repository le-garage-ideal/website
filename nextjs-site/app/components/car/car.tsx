'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spec from './spec';
import { fullname } from '../../../functions/cars';
import carStyles from './car.module.scss';
import { Car as CarType } from '../../../types/car';

type CarProps = {
  car: CarType;
  id: string;
  className: string;
};
export const Car = ({ car, id, className }: CarProps) => {
  const carFullname = fullname(car);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const clickLeft = () => {
    setCurrentPageIndex(currentPageIndex - 1);
  };

  const clickRight = () => {
    setCurrentPageIndex(currentPageIndex + 1);
  };

  let divContent = null;
  if (currentPageIndex === 0) {
    divContent = (
      <motion.img
        src={car.imageFile?.url}
        className={carStyles.image}
        alt={carFullname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    );
  } else {
    divContent = (
      <Spec
        power={car.power}
        weight={car.weight}
        officialWeight={car.officialWeight}
        imageUrl={car.selectedFavcarsUrl}
      />
    );
  }

  return (
    <article className={`${carStyles.card} ${className}`}>

      <a href={car.imageFile?.url} className={carStyles.imageContainer}>
        { divContent }
      </a>

      <div className={carStyles.carCaption}>
        <div className={carStyles.switchButtons}>
          {
            currentPageIndex === 1
            && (
              <button type="button" className={['icon-button', 'icon', carStyles.iconButton].join(' ')}>
                <FontAwesomeIcon icon="image" size="2x" onClick={clickLeft} />
              </button>
            )
          }
          {
            currentPageIndex === 0
            && (
            <button type="button" className={['icon-button', 'icon', carStyles.iconButton].join(' ')}>
              <FontAwesomeIcon icon="exchange-alt" size="2x" onClick={clickRight} />
            </button>
            )
          }
        </div>
        <div className={carStyles.carTitle}>
          <h3 className={carStyles.carLongLabel} title={carFullname}>{carFullname}</h3>
        </div>
        <div className={carStyles.carYear}>{car.startYear}</div>
      </div>

    </article>
  );
};
