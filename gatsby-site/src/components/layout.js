import React from "react";
export default function Layout({ children }) {
    return (
        <main className="app-container">
            <div className="overlay"></div>
            {children}
        </main>

    );
}
