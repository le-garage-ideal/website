import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch)
export default function Layout({ children }) {
    return (
        <React.Fragment>
            <div className="overlay" style={{ zIndex: -1 }}></div>
            <div className="background" style={{ zIndex: -2 }}></div>
            <main className="app-container">
                {children}
            </main>
        </React.Fragment>

    );
}
