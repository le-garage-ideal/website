import React, { PropsWithChildren, ReactNode, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import filteredListStyles from './filtered-list.module.scss';

type FilteredListProps = {
  title: string;
  filter: (s: string | undefined) => void;
};
const FilteredList = ({ title, filter, children }: PropsWithChildren<FilteredListProps>) => {
  const [previousFilterValue, setPreviousFilterValue] = useState<string | undefined>();
  const [filterInputTimeout, setFilterInputTimeout] = useState<number | undefined>();

  const search = () => {
    const input: HTMLInputElement | null = document.querySelector('#search-input');
    if (input?.value !== previousFilterValue) { // if text has changed
      clearTimeout(filterInputTimeout); // this will interrupt previous search
      const timer = setTimeout(() => filter(input?.value), 700); // this will trigger new search some delay

      // we save timer and values for later calls
      // @ts-ignore
      setFilterInputTimeout(timer);
      setPreviousFilterValue(input?.value);
    }
  };

  return (
    <>
      <header className={['field', 'is-size-4', filteredListStyles.listHeader].join(' ')}>
        <h1 className="has-text-light">{title}</h1>
        <p className="control has-text-dark has-icons-right">
          <input
            id="search-input"
            type="text"
            onKeyUp={search}
            className={[filteredListStyles.searchInput, 'input'].join(' ')}
          />
          <span className="icon is-right">
            <FontAwesomeIcon icon="search" />
          </span>
        </p>
      </header>
      <ul className={filteredListStyles.list}>
        {children}
      </ul>
    </>
  );
};
export default FilteredList;
