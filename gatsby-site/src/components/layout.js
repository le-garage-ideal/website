import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faEdit, faThList, faImage, faBars } from '@fortawesome/free-solid-svg-icons';
import layoutStyles from  './layout.module.scss';

library.add(faSearch);
library.add(faEdit);
library.add(faThList);
library.add(faImage);
library.add(faBars);

export default function Layout({ children }) {
    return (
        <React.Fragment>
            <div className={layoutStyles.overlay} style={{ zIndex: -1 }}></div>
            <div className={layoutStyles.background} style={{ zIndex: -2 }}></div>
            <main className={layoutStyles.appContainer}>
                {children}
            </main>
        </React.Fragment>

    );
}

export function EmptyLayout({ children }) {
    return (
        <React.Fragment>
                {children}
        </React.Fragment>

    );
}
