import React from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch  } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch)
export default function Layout({ children }) {
    return (
        <main className="app-container">
            <div className="overlay"></div>
            {children}
        </main>

    );
}
