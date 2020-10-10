import React, { useState } from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faEdit, faThList, faImage, faBars, faPlus, faSave, faShareSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import layoutStyles from './layout.module.scss';
import Menu from './utils/menu';
import { Toast } from './utils/toast';
import {copyToClipboard} from '../functions/clipboard';
import {
    FacebookShareButton,
    TwitterShareButton,
    FacebookIcon,
    TwitterIcon,
    RedditShareButton,
    RedditIcon,
} from "react-share";


library.add(faSearch);
library.add(faEdit);
library.add(faThList);
library.add(faImage);
library.add(faBars);
library.add(faPlus);
library.add(faSave);
library.add(faShareSquare);

const BUTTON_HEIGHT = '40px';

export function Layout({ title, uri, children, save, saveDisabled, showSaveMessage }) {

    const [showMenu, setShowMenu] = useState(false);
    const [shareModalState, setShareModalState] = useState('');
    const [shareCopySuccessMessage, setShareCopySuccessMessage] = useState(null);
    const [shareCopyErrorMessage, setShareCopyErrorMessage] = useState(null);

    const menuButtonClass = [layoutStyles.menuButton, 'icon-button'];
    if (showMenu) {
        menuButtonClass.push(layoutStyles.menuExpanded);
    }

    const onShareCopyClick = () => {
        copyToClipboard(uri).then(() => {
            setShareCopySuccessMessage('Lien copié dans le presse-papier');
            setTimeout(() => setShareCopySuccessMessage(null), 5000);
        }, () => {
            setShareCopyErrorMessage('Impossible! copier le lien manuellement');
            setTimeout(() => setShareCopyErrorMessage(null), 5000);
        });
    }

    return (
        <React.Fragment>
            <div className={layoutStyles.overlay}></div>
            <div id="background" className={layoutStyles.background}></div>
            <div className={layoutStyles.appContainer}>
                <header className={layoutStyles.appHeader}>
                    <div className={layoutStyles.menu}>
                        <button className={menuButtonClass.join(' ')} onClick={() => setShowMenu(!showMenu)}>
                            <FontAwesomeIcon icon="bars" className={layoutStyles.menuButtonIcon} />
                        </button>
                        {showMenu && <Menu uri={uri} />}
                    </div>
                    {uri &&
                        <div className={layoutStyles.shareButtonsBar}>
                            <button title="Partager"
                                className={['icon-button', layoutStyles.customButton].join(' ')}
                                onClick={() => { setShareModalState('is-active') }}
                                style={{ height: BUTTON_HEIGHT }}>
                                <FontAwesomeIcon icon="share-square" />
                            </button>
                            <button title={saveDisabled ? 'Garage déjà sauvegardé' : 'Sauvegarder'}
                                className={['icon-button', layoutStyles.customButton].join(' ')}
                                disabled={saveDisabled}
                                onClick={() => { if (save) save() }}
                                style={{ height: BUTTON_HEIGHT }}>
                                <FontAwesomeIcon icon="save" />
                            </button>
                            <FacebookShareButton title={title} url={uri.replace('localhost:8000', 'perfect-garage.org')} quote={title}>
                                <FacebookIcon size={BUTTON_HEIGHT} />
                            </FacebookShareButton>
                            <TwitterShareButton title={title} url={uri}>
                                <TwitterIcon size={BUTTON_HEIGHT} />
                            </TwitterShareButton>
                            <RedditShareButton title={title} url={uri}>
                                <RedditIcon size={BUTTON_HEIGHT} />
                            </RedditShareButton>
                            {showSaveMessage && 
                                <div style={{position: 'absolute'}}><Toast classNames={['is-success']}>Garage sauvegardé!</Toast></div>}
                        </div>
                    }
                </header>

                <div className={[layoutStyles.popup, 'modal', shareModalState].join(' ')}>
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="field is-vertical">
                            <label className="label has-text-light" htmlFor="share-link">Partagez ce lien : </label>
                            <p className="control">
                                <input type="text" name="share-link" id="share-link" value={uri}
                                    className="input is-primary" readOnly={true} />
                            </p>
                        </div>
                        <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '20px', height: '80px'}}>
                            <button className="button" style={{ marginRight: '10px' }} onClick={() => { onShareCopyClick() }}>Copier</button>
                            {shareCopySuccessMessage && <Toast classNames={['is-success']}>{shareCopySuccessMessage}</Toast>}
                            {shareCopyErrorMessage && <Toast classNames={['is-error']}>{shareCopyErrorMessage}</Toast>}
                        </div>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={() => setShareModalState('')}></button>
                </div>

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
