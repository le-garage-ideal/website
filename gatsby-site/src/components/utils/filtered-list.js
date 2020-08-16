
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import filteredListStyles from  './filtered-list.module.scss';

const FilteredList = ({title, render, filter}) => {

    const [previousFilterValue, setPreviousFilterValue] = useState(null);
    const [filterInputTimeout, setFilterInputTimeout] = useState(null);

    const search = () => {
        const input = document.querySelector('.input');
        if (input.value !== previousFilterValue) { // if text has changed

            clearTimeout(filterInputTimeout); // this will interrupt previous search
            const timer = setTimeout(() => filter(input.value), 700); // this will trigger new search some delay

            // we save timer and values for later calls
            setFilterInputTimeout(timer);
            setPreviousFilterValue(input.value);

        }
    };

    return (
        <>
            <header className={["field", "is-size-4", filteredListStyles.listHeader].join(' ')}>
                <h1 className="has-text-light">{ title }</h1>
                <p className="control has-text-dark has-icons-right">
                    <input type="text" onKeyUp={search} className={[filteredListStyles.searchInput, 'input'].join(' ')} />
                    <span className="icon is-right">
                        <FontAwesomeIcon icon="search" />
                    </span>
                </p>
            </header>
            <ul className={filteredListStyles.list}>
                {render()}
            </ul>
        </>
    );
}

export default FilteredList;
