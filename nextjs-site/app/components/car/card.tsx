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
  label: string;
  marginCard?: boolean;
  car?: Car;
  index: number;
  OnCardEdit?: (index: number) => void;
  onLabelChanged?: (s: string) => void;
};
export const Card = ({
  car, index, marginCard, label, onLabelChanged, OnCardEdit, children,
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

  const [editedLabel, setEditedLabel] = useState(label);
  const [editModeLabel, setEditModeLabel] = useState(false);
  const labelChanged = ({ target: { value: newLabel } }: any) => setEditedLabel(newLabel);
  const enableEditModeLabel = () => {
    setEditModeLabel(true);
  };
  const saveLabel = () => {
    setEditModeLabel(false);
    if (onLabelChanged) {
      onLabelChanged(editedLabel);
    }
  };
  const cancelEditModeLabel = () => {
    setEditedLabel(label);
    setEditModeLabel(false);
  };

  const carLabelClasses = [cardStyles.carLabel, 'badge'];
  if (onLabelChanged) { // if function is not null, it's because a car was selected so we can show "edit label" button
    carLabelClasses.push(cardStyles.carLabelEdit);
  }

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
        { car ? (
          <div className={cardStyles.carButtons}>
            <button
              type="button"
              className={`${cardStyles.iconButton} icon-button`}
              onClick={switchView}
            >
              <FontAwesomeIcon icon="exchange-alt" />
            </button>
            { editButton }
          </div>
        ) : editButton}

        { divContent }
      </a>

      <div className={[cardStyles.carLabelContainer, 'container', 'is-fluid'].join(' ')}>
        <div className={carLabelClasses.join(' ')}>
          {
            editModeLabel && (
              <div className="control has-text-dark" style={{ display: 'flex' }}>
                <input
                  id="search-input"
                  type="text"
                  onChange={labelChanged}
                  className="input"
                  style={{ flex: 1 }}
                  value={editedLabel ?? ''}
                />
                <button type="button" className={`${cardStyles.iconButton} icon-button`} onClick={cancelEditModeLabel}>
                  <FontAwesomeIcon icon="times" />
                </button>
                <button type="button" className={`${cardStyles.iconButton} icon-button`} onClick={saveLabel}>
                  <FontAwesomeIcon icon="check" />
                </button>
              </div>
            )
          }
          {
            !editModeLabel && (
              <>
                <div className={cardStyles.labelEditContainer}>{label}</div>
                {
                  onLabelChanged && (
                    <button
                      type="button"
                      className={["icon-button", cardStyles.iconButton, cardStyles.labelEditButton].join(' ')}
                      onClick={enableEditModeLabel}
                    >
                      <FontAwesomeIcon icon="edit" />
                    </button>
                  )
                }
              </>
            )
          }
        </div>
      </div>
    </div>
  );
};

