'use client';
import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cardStyles from './card.module.scss';

type CardProps = {
  label: string;
  marginCard?: boolean;
  empty?: boolean;
  index: number;
  edit: (i: number) => void;
  render: () => void;
  editButtonId: string;
  onLabelChanged?: (s: string) => void;
};
export const Card = ({
  empty, marginCard, index, edit, render, editButtonId, label, onLabelChanged,
}: CardProps) => {
  const classCard = [cardStyles.card];
  if (marginCard) {
    classCard.push(cardStyles.marginCard);
  }
  if (empty) {
    classCard.push(cardStyles.cardWithoutCar);
  } else {
    classCard.push(cardStyles.cardWithCar);
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

  return (
    <div className={classCard.join(' ')}>
      <div id={editButtonId} className={cardStyles.iconButtonContainer}>
        <button type="button" className={`${cardStyles.iconButton} icon-button`} onClick={() => edit(index)}>
          <FontAwesomeIcon icon="edit" />
        </button>
      </div>
      <>{render()}</>
      <div className={[cardStyles.carLabelContainer, 'container', 'is-fluid'].join(' ')}>
        <div className={carLabelClasses.join(' ')}>
          {
            editModeLabel && (
              <p className="control has-text-dark" style={{ display: 'flex' }}>
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
              </p>
            )
          }
          {
            !editModeLabel && (
              <>
                <div style={{ flex: 1 }}>{label}</div>
                {
                  onLabelChanged && (
                    <button
                      type="button"
                      className={`${cardStyles.iconButton} icon-button`}
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

