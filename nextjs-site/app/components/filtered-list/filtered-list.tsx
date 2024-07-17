'use client';
import React, { PropsWithChildren, ReactNode, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import filteredListStyles from './filtered-list.module.scss';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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
    <article className={filteredListStyles.listContainer}>
      <header className={['field', filteredListStyles.listHeader].join(' ')}>
        <h1 className={['has-text-light', filteredListStyles.listHeaderTitle].join(' ')}>{title}</h1>
        <p className={filteredListStyles.searchField}>
          <input
            id="search-input"
            type="text"
            onKeyUp={search}
            className={[filteredListStyles.searchInput, 'input'].join(' ')}
          />
          <span className={filteredListStyles.searchIcon}>
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </p>
      </header>
      <ul className={filteredListStyles.list}>
        {children}
      </ul>
    </article>
  );
};
export default FilteredList;
