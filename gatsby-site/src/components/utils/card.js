import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as cardStyles from './card.module.scss';

export const Card = ({
  empty, marginCard, index, edit, render, editButtonId, label, onLabelChanged,
}) => {
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
  const labelChanged = ({ target: { value: newLabel } }) => setEditedLabel(newLabel);
  const enableEditModeLabel = () => {
    setEditModeLabel(true);
  };
  const saveLabel = () => {
    setEditModeLabel(false);
    onLabelChanged(editedLabel);
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
      {render()}
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
                  value={editedLabel}
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

Card.propTypes = {
  label: PropTypes.string.isRequired,
  marginCard: PropTypes.bool,
  empty: PropTypes.bool,
  index: PropTypes.number.isRequired,
  edit: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  editButtonId: PropTypes.string.isRequired,
  onLabelChanged: PropTypes.func,
};

Card.defaultProps = {
  marginCard: false,
  empty: false,
  onLabelChanged: null,
};
