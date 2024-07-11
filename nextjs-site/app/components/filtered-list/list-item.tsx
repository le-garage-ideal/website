'use client';
import Image from 'next/image';
import { PropsWithChildren } from 'react';

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
  id, name, image, onClick, selected, big, children
}: PropsWithChildren<ListItemProps>) => {
  const classNames = [listItemStyles.logoLink];
  if (selected) {
    classNames.push(listItemStyles.selected);
  }

  const style = {
    width: big ? '22.5em' : '7.5em',
    height: big ? '15em' : '7.5em',
  } as React.CSSProperties;

  return (
    <button type="button" className={classNames.join(' ')} style={style} onClick={() => onClick(id)}>
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
      { image && (
          big ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_IMG_URL}${image}`}
              alt={name}
              style={{objectFit: 'contain'}}
              fill
            />
          ) : (
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_IMG_URL}${image}`}
              alt={name}
              style={{objectFit: 'contain'}}
              fill
            />
          )
        )
      }
      </div>
      <div>{children}</div>
    </button>
  );
};

export default ListItem;
