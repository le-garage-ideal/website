import React from 'react';
import listItemStyles from './list-item.module.scss';

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
    <li>
      <button type="button" className={classNames.join(' ')} onClick={() => onClick(id)}>
        <figure>
          <img src={image} alt={name} />
          <figcaption>{name}</figcaption>
        </figure>
      </button>
    </li>
  );
};

export default ListItem;
