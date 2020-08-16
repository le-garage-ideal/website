import React, {useState} from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faEdit, faThList, faImage, faBars, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import layoutStyles from  './layout.module.scss';
import Menu from './utils/menu';
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
  } from "react-share";

library.add(faSearch);
library.add(faEdit);
library.add(faThList);
library.add(faImage);
library.add(faBars);
library.add(faPlus);

export default function Layout({ location, children }) {

    const [showMenu, setShowMenu] = useState(false);

    const menuButtonClass = [layoutStyles.menuButton, 'icon-button'];
    if (showMenu) {
        menuButtonClass.push(layoutStyles.menuExpanded);
    }

    return (
        <React.Fragment>
            <div className={layoutStyles.overlay} style={{ zIndex: -1 }}></div>
            <div className={layoutStyles.background} style={{ zIndex: -2 }}></div>
            <div className={layoutStyles.appContainer}>
                <header className={layoutStyles.appHeader}>
                    <div className={layoutStyles.menu}>
                        <button className={menuButtonClass.join(' ')} onClick={() => setShowMenu(!showMenu)}>
                            <FontAwesomeIcon icon="bars" />
                        </button>
                        { showMenu && <Menu /> }
                    </div>
                    { location && 
                        <div className={layoutStyles.shareButtonsBar}>
                            <FacebookShareButton url={location}>
                                <FacebookIcon size="32" />
                            </FacebookShareButton>
                            <TwitterShareButton url={location}>
                                <TwitterIcon size="32" />
                            </TwitterShareButton>
                        </div>
                    }
                </header>
                <main className={layoutStyles.appBody}>
                    {children}
                </main>
                <footer className={layoutStyles.appFooter}>
                    Site hébergé par <a href="o2switch.fr">o2switch.fr</a>. Aucun cookie ni aucune donnée personnelle ne sont utilisés.
                </footer>
            </div>
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
