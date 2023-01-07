import Image from 'next/image';
import React from 'react';

import listItemStyles from './list-item.module.scss';

type ListItemProps = {
  id: number | string;
  name: string;
  image?: string;
  onClick: (id: number | string) => void;
  selected?: boolean;
  big?: boolean;
};
const ListItem = ({
  id, name, image, onClick, selected, big,
}: ListItemProps) => {
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
        { image &&
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt={name} />
        }
        <figcaption>{name}</figcaption>
      </figure>
    </button>
  );
};

export default ListItem;
