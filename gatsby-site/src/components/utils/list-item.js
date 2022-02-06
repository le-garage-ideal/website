import React from 'react';
import PropTypes from 'prop-types';
import * as listItemStyles from './list-item.module.scss';

const ListItem = ({
  id, name, image, onClick, selected, big,
}) => {
  const classNames = [listItemStyles.logoLink];
  if (selected) {
    classNames.push(listItemStyles.selected);
  }

  if (big) {
    classNames.push(listItemStyles.logoLinkBig);
  } else {
    classNames.push(listItemStyles.logoLinkSmall);
  }

  return (
    <button type="button" className={classNames.join(' ')} onClick={() => onClick(id)}>
      <figure>
        <img src={image} alt={name} />
        <figcaption>{name}</figcaption>
      </figure>
    </button>
  );
};

ListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  big: PropTypes.bool,
};

ListItem.defaultProps = {
  selected: false,
  big: false,
};

export default ListItem;
