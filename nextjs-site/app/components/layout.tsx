import React, { PropsWithChildren, useContext, useState } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSearch,
  faEdit,
  faExchangeAlt,
  faImage,
  faBars,
  faPlus,
  faSave,
  faShareSquare,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
} from 'react-share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import layoutStyles from './layout.module.scss';
import Menu from './utils/menu';
import { Toast } from './utils/toast';
import { copyToClipboard } from '../../functions/clipboard';
import { I18nContext } from '../../functions/i18n';

library.add(faSearch);
library.add(faEdit);
library.add(faExchangeAlt);
library.add(faImage);
library.add(faBars);
library.add(faPlus);
library.add(faSave);
library.add(faShareSquare);
library.add(faCheck);
library.add(faTimes);

const BUTTON_HEIGHT = '40px';

type LayoutProps = {
  title: string;
  uri: string;
  save?: () => void;
  saveDisabled?: boolean;
  saveMessage?: string;
  showButtons?: boolean;
};
export const Layout = ({
  title = '',
  uri,
  children,
  save,
  saveDisabled = false,
  saveMessage,
  showButtons = false,
}: PropsWithChildren<LayoutProps>) => {
  const i18n = useContext(I18nContext);
  const [showMenu, setShowMenu] = useState(false);
  const [shareModalState, setShareModalState] = useState('');
  const [shareCopySuccessMessage, setShareCopySuccessMessage] = useState(null);
  const [shareCopyErrorMessage, setShareCopyErrorMessage] = useState(null);
  const menuButtonClass = [layoutStyles.menuButton, 'icon-button'];
  if (showMenu) {
    menuButtonClass.push(layoutStyles.menuExpanded);
  }

  const windowLocation = window.location?.href;

  const onShareCopyClick = () => {
    copyToClipboard(windowLocation).then(() => {
      setShareCopySuccessMessage(i18n['components.layout.link_clipboard_ok']);
      setTimeout(() => setShareCopySuccessMessage(null), 5000);
    }, () => {
      setShareCopyErrorMessage(i18n['components.layout.link_clipboard_ko']);
      setTimeout(() => setShareCopyErrorMessage(null), 5000);
    });
  };

  const savedButtonTooltip = saveDisabled
    ? i18n['components.layout.saved_button_tooltip_ok']
    : i18n['components.layout.saved_button_tooltip_ko'];

  const footer = (
    <footer className={layoutStyles.appFooter}>
      <span>{i18n['components.layout.first_footer']}</span>
      <a href="https://o2switch.fr">o2switch.fr</a>
      <span>{i18n['components.layout.second_footer']}</span>
    </footer>
  );

  const shareWithLabel = i18n['components.layout.share_with'] as string;

  return (
    <>
      <div className={layoutStyles.overlay} />
      <div id="background" className={layoutStyles.background} />
      <div className={layoutStyles.appContainer}>
        <header className={layoutStyles.appHeader}>
          <div className={layoutStyles.menu}>
            <button type="button" className={menuButtonClass.join(' ')} onClick={() => setShowMenu(!showMenu)}>
              <FontAwesomeIcon icon="bars" className={layoutStyles.menuButtonIcon} />
            </button>
            {showMenu && <Menu uri={uri} />}
          </div>
          {showButtons
            && (
            <div className={layoutStyles.shareButtonsBar}>
              <button
                type="button"
                title={savedButtonTooltip}
                className={['icon-button', layoutStyles.saveButton].join(' ')}
                onClick={() => { if (save) save(); }}
                style={{ height: BUTTON_HEIGHT }}
              >
                {!saveDisabled && <span className={layoutStyles.saveButtonIndicator}>·</span>}
                <FontAwesomeIcon icon="save" />
              </button>
              <button
                type="button"
                title={i18n['components.layout.share_link']}
                className={['icon-button', layoutStyles.customShareButton].join(' ')}
                onClick={() => { setShareModalState('is-active'); }}
                style={{ height: BUTTON_HEIGHT }}
              >
                <FontAwesomeIcon icon="share-square" />
              </button>
              <div title={shareWithLabel.replace('{network}', 'Facebook')}>
                <FacebookShareButton
                  quote={i18n['components.layout.share_title']}
                  url={windowLocation}
                >
                  <FacebookIcon size={BUTTON_HEIGHT} />
                </FacebookShareButton>
              </div>
              <div title={shareWithLabel.replace('{network}', 'Twitter')}>
                <TwitterShareButton
                  title={i18n['components.layout.share_title']}
                  url={windowLocation}
                >
                  <TwitterIcon size={BUTTON_HEIGHT} />
                </TwitterShareButton>
              </div>
              <div title={shareWithLabel.replace('{network}', 'Reddit')}>
                <RedditShareButton
                  title={i18n['components.layout.share_title']}
                  url={windowLocation}
                >
                  <RedditIcon size={BUTTON_HEIGHT} />
                </RedditShareButton>
              </div>
              {saveMessage
                && (
                  <div style={{ position: 'absolute' }}>
                    <Toast classNames={['is-success']}>{saveMessage}</Toast>
                  </div>
                )}
            </div>
            )}
        </header>

        <div className={['modal', shareModalState].join(' ')}>
          <div className="modal-background" />
          <div className="modal-content">
            <div className="field is-vertical">
              <label className="label has-text-light" htmlFor="share-link">
                { i18n['components.layout.link_share_it']}
              </label>
              <p className="control">
                <input
                  type="text"
                  name="share-link"
                  id="share-link"
                  value={windowLocation}
                  className="input is-primary"
                  readOnly
                />
              </p>
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', marginTop: '20px', height: '80px',
            }}
            >
              <button
                type="button"
                className="button"
                style={{ marginRight: '10px' }}
                onClick={() => { onShareCopyClick(); }}
              >
                Copier
              </button>
              {shareCopySuccessMessage && <Toast classNames={['is-success']}>{shareCopySuccessMessage}</Toast>}
              {shareCopyErrorMessage && <Toast classNames={['is-error']}>{shareCopyErrorMessage}</Toast>}
            </div>
          </div>
          <button
            type="button"
            className="modal-close is-large"
            aria-label="close"
            onClick={() => setShareModalState('')}
          />
        </div>

        <main className={layoutStyles.appBody}>
          {children}
        </main>
        { footer }
      </div>
    </>
  );
};

export const EmptyLayout = ({ children }: PropsWithChildren<{}>) => (<>{children}</>);
