import React from 'react';
import brandStyles from  './brand.module.scss';

export default function Brand({id, name, image, onClick, selected}) {

  const classNames = [brandStyles.logoLink];
  if (selected) {
    classNames.push(brandStyles.selected);
  }

  return (<li>
    <figure className={ classNames.join(' ') } onClick={() => onClick(id)}>
        <img src={image} alt={name} style={{width: '50px'}} />
        <figcaption><button>{name}</button></figcaption>
    </figure>
  </li>);
}


