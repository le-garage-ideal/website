import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cardStyles from './card.module.scss';

export const Card = ({
  empty, marginCard, index, edit, render, editButtonId, title,
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
  return (
    <div className={classCard.join(' ')}>
      <div id={editButtonId} className={cardStyles.iconButtonContainer}>
        <button type="button" className={`${cardStyles.iconButton} icon-button`} onClick={() => edit(index)}>
          <FontAwesomeIcon icon="edit" />
        </button>
      </div>
      {render()}
      <div className={[cardStyles.carLabelContainer, 'container', 'is-full'].join(' ')}>
        <span className={[cardStyles.carLabel, 'badge'].join(' ')}>{title}</span>
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  marginCard: PropTypes.bool,
  empty: PropTypes.bool,
  index: PropTypes.number.isRequired,
  edit: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  editButtonId: PropTypes.string.isRequired,
};

Card.defaultProps = {
  marginCard: false,
  empty: false,
};
