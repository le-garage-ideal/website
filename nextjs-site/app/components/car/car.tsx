'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spec from './spec';
import { fullname } from '../../../functions/cars';
import carStyles from './car.module.scss';
import { Car as CarType } from '../../../types/car';

type CarProps = {
  car: CarType | undefined;
  className: string;
  index: number;
  edit?: (index: number) => void;
};
export const Car = ({ car, className, index, edit }: CarProps) => {
  const carFullname = car ? fullname(car) : '';

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const clickLeft = () => {
    setCurrentPageIndex(currentPageIndex - 1);
  };

  const clickRight = () => {
    setCurrentPageIndex(currentPageIndex + 1);
  };

  const onEdit = () => {
    if (edit) {
      edit(index);
    }
  };

  let divContent = null;
  const containerClassnames = [carStyles.commonContainer];
  if (car) {
    if (currentPageIndex === 0) {
      divContent = (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={carStyles.imageContainer}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_IMG_URL}${car.imageFile?.url}`}
            className={carStyles.image}
            alt={carFullname}
          />        
        </motion.div>
      );
      containerClassnames.push(carStyles.imageContainer)
    } else {
      divContent = (
        <Spec
          power={car.power}
          weight={car.weight}
          officialWeight={car.officialWeight}
          imageUrl={car.selectedFavcarsUrl}
        />
      );
      containerClassnames.push(carStyles.specContainer)
    }
  } else {
    divContent = (
      <></>
    );
  }

  return (
    <article className={`${carStyles.card} ${className}`}>
      <a href={car?.imageFile?.url} className={containerClassnames.join(' ')} title={`${carFullname} - ${car.startYear}`}>
        <button type="button" className={`${carStyles.iconButton} icon-button`} onClick={onEdit}>
          <FontAwesomeIcon icon="edit" />
        </button>
        { divContent }
      </a>
    </article>
  );
};
