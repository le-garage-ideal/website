import React from 'react';
import listItemStyles from  './list-item.module.scss';

export default function ListItem({id, name, image, onClick, selected}) {

  const classNames = [listItemStyles.logoLink];
  if (selected) {
    classNames.push(listItemStyles.selected);
  }

  return (<li>
    <button className={ classNames.join(' ') } onClick={() => onClick(id)}>
      <figure>
          <img src={image} alt={name} />
          <figcaption>{name}</figcaption>
      </figure>
    </button>
  </li>);
}


