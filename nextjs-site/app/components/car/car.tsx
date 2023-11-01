'use client';
import React, { useState, MouseEvent } from 'react';
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

  const [imageView, setImageView] = useState(true);

  const switchView = (e: MouseEvent) => {
    e.preventDefault();
    setImageView(!imageView);
  };

  const onEdit = (e: MouseEvent) => {
    e.preventDefault();
    if (edit) {
      edit(index);
    }
  };

  let divContent = null;
  const cardClassnames = [carStyles.card];
  const containerClassnames = [carStyles.commonContainer];
  const buttonClassnames = [carStyles.iconButton];
  if (car) {
    if (imageView) {
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
      containerClassnames.push(carStyles.imageContainer);
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
    cardClassnames.push(carStyles.cardWithCar);
  } else {
    divContent = (
      <></>
    );
    cardClassnames.push(carStyles.emptyCard);
    containerClassnames.push(carStyles.emptyContainer);
  }

  const editButton = (
    <button
      type="button"
      className={`${buttonClassnames.join(' ')} icon-button`}
      onClick={onEdit}
    >
      <FontAwesomeIcon icon="edit" />
    </button>
  );

  return (
    <article className={`${cardClassnames.join(' ')} ${className}`}>
      <a
        href={car?.imageFile?.url}
        className={containerClassnames.join(' ')}
        title={`${carFullname} - ${car?.startYear}`}
        onClick={(e) => {
          if (!car) {
            onEdit(e);
          };
        }}
      >
        { car ? (
          <div style={{ display: 'flex', position: 'absolute' }}>
            <button
              type="button"
              className={`${buttonClassnames.join(' ')} icon-button`}
              onClick={switchView}
            >
              <FontAwesomeIcon icon="exchange-alt" />
            </button>
            { editButton }
          </div>
        ) : editButton}

        { divContent }
      </a>
    </article>
  );
};
