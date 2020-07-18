import React, {useState} from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faEdit, faThList, faImage, faBars } from '@fortawesome/free-solid-svg-icons';
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

export default function Layout({ children }) {

    const [showMenu, setShowMenu] = useState(false);

    const menuButtonClass = [layoutStyles.menuButton, 'icon-button'];
    if (showMenu) {
        menuButtonClass.push(layoutStyles.menuExpanded);
    }

    return (
        <React.Fragment>
            <div className={layoutStyles.overlay} style={{ zIndex: -1 }}></div>
            <div className={layoutStyles.background} style={{ zIndex: -2 }}></div>
            <main className={layoutStyles.appContainer}>
                <div className={layoutStyles.menu}>
                    <button className={menuButtonClass.join(' ')} onClick={() => setShowMenu(!showMenu)}>
                        <FontAwesomeIcon icon="bars" />
                    </button>
                    { showMenu && <Menu /> }
                </div>
                <div className={layoutStyles.shareButtonsBar}>
                    <FacebookShareButton url={document.URL}>
                        <FacebookIcon size="32" />
                    </FacebookShareButton>
                    <TwitterShareButton url={document.URL}>
                        <TwitterIcon size="32" />
                    </TwitterShareButton>
                </div>
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
