'use client';
import React, { PropsWithChildren, useState, MouseEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { motion } from 'framer-motion';

import cardStyles from './card.module.scss';
import { Car } from '../../../types/car';
import Spec from './spec';
import { fullname } from '../../../functions/cars';

type CardProps = {
  marginCard?: boolean;
  car?: Car;
  index: number;
  OnCardEdit?: (index: number) => void;
};
export const Card = ({
  car, index, marginCard, OnCardEdit,
}: PropsWithChildren<CardProps>) => {
  const classCard = [cardStyles.card];
  if (marginCard) {
    classCard.push(cardStyles.marginCard);
  }
  if (car) {
    classCard.push(cardStyles.cardWithCar);

  } else {
    classCard.push(cardStyles.cardWithoutCar);
  }

  const carLabelClasses = [cardStyles.carLabel, 'badge'];

  const carFullname = car ? fullname(car) : '';

  const [imageView, setImageView] = useState(true);

  const switchView = (e: MouseEvent) => {
    e.preventDefault();
    setImageView(!imageView);
  };

  const onEdit = (e: MouseEvent) => {
    e.preventDefault();
    if (OnCardEdit) {
      OnCardEdit(index);
    }
  };

  let divContent = null;
  const containerClassnames = [cardStyles.commonContainer];
  const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_BASE_IMG_URL}${car?.imageFile?.url}`;
  if (car) {
    if (imageView) {
      divContent = (
        <Image
          src={imageUrl}
          alt={carFullname}
          fill
          sizes="(min-width: 1024px) 30vw, 95vw"
          style={{
            objectFit: 'contain', // cover, contain, none
          }}
        />        
      );
      containerClassnames.push(cardStyles.imageContainer);
    } else {
      divContent = (
        <Spec
          power={car.power}
          weight={car.weight}
          officialWeight={car.officialWeight}
          imageUrl={car.selectedFavcarsUrl}
        />
      );
      containerClassnames.push(cardStyles.specContainer)
    }
  } else {
    divContent = (
      <></>
    );
    containerClassnames.push(cardStyles.emptyContainer);
  }

  const editButton = (
    <button
      type="button"
      className={["icon-button", cardStyles.iconButton, cardStyles.editButton].join(' ')}
      onClick={onEdit}
    >
      <FontAwesomeIcon icon="edit" />
    </button>
  );

  return (
    <div className={classCard.join(' ')}>
      <a
        href={imageUrl}
        className={containerClassnames.join(' ')}
        onClick={(e) => {
          if (!car) {
            onEdit(e);
          };
        }}
      >
        { !car && editButton }
        { divContent }
      </a>

      <div className={[cardStyles.carLabelContainer, 'container', 'is-fluid'].join(' ')}>
        <div className={carLabelClasses.join(' ')}>
          <div className={[cardStyles.labelEditContainer, !car && cardStyles.carLabelEmpty].join(' ')}>{car ? car.label : 'Select a car'}</div>
          { car && (
            <div className={cardStyles.carButtons}>
              <button
                type="button"
                className={["icon-button", cardStyles.iconButton, cardStyles.labelEditButton].join(' ')}
                onClick={switchView}
              >
                <FontAwesomeIcon icon="exchange-alt" />
              </button>
              { editButton }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

