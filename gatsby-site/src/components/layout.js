import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import { useIntl } from 'gatsby-plugin-react-intl';
import * as layoutStyles from './layout.module.scss';
import Menu from './utils/menu';
import { Toast } from './utils/toast';
import { copyToClipboard } from '../functions/clipboard';

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

export const Layout = ({
  title, uri, children, save, saveDisabled, saveMessage, showButtons,
}) => {
  const intl = useIntl();

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
      setShareCopySuccessMessage(intl.formatMessage({ id: 'components.layout.link_clipboard_ok' }));
      setTimeout(() => setShareCopySuccessMessage(null), 5000);
    }, () => {
      setShareCopyErrorMessage(intl.formatMessage({ id: 'components.layout.link_clipboard_ko' }));
      setTimeout(() => setShareCopyErrorMessage(null), 5000);
    });
  };

  const savedButtonTooltip = saveDisabled
    ? intl.formatMessage({ id: 'components.layout.saved_button_tooltip_ok' })
    : intl.formatMessage({ id: 'components.layout.saved_button_tooltip_ko' });

  const footer = (
    <footer className={layoutStyles.appFooter}>
      <span>{intl.formatMessage({ id: 'components.layout.first_footer' })}</span>
      <a href="o2switch.fr">o2switch.fr</a>
      <span>{intl.formatMessage({ id: 'components.layout.second_footer' })}</span>
    </footer>
  );

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
                title={intl.formatMessage({ id: 'components.layout.share_link' })}
                className={['icon-button', layoutStyles.customShareButton].join(' ')}
                onClick={() => { setShareModalState('is-active'); }}
                style={{ height: BUTTON_HEIGHT }}
              >
                <FontAwesomeIcon icon="share-square" />
              </button>
              <div title={intl.formatMessage({ id: 'components.layout.share_with' }, { network: 'Facebook' })}>
                <FacebookShareButton
                  quote={intl.formatMessage({ id: 'components.layout.share_title' })}
                  url={uri.replace('localhost:8000', 'perfect-garage.org')}
                  quote={title}
                >
                  <FacebookIcon size={BUTTON_HEIGHT} />
                </FacebookShareButton>
              </div>
              <div title={intl.formatMessage({ id: 'components.layout.share_with' }, { network: 'Twitter' })}>
                <TwitterShareButton
                  title={intl.formatMessage({ id: 'components.layout.share_title' })}
                  url={uri}
                >
                  <TwitterIcon size={BUTTON_HEIGHT} />
                </TwitterShareButton>
              </div>
              <div title={intl.formatMessage({ id: 'components.layout.share_with' }, { network: 'Reddit' })}>
                <RedditShareButton
                  title={intl.formatMessage({ id: 'components.layout.share_title' })}
                  url={uri}
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
                { intl.formatMessage({ id: 'components.layout.link_share_it' })}
              </label>
              <p className="control">
                <input
                  type="text"
                  name="share-link"
                  id="share-link"
                  value={uri}
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

Layout.propTypes = {
  title: PropTypes.string,
  uri: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  save: PropTypes.func,
  saveDisabled: PropTypes.bool,
  saveMessage: PropTypes.string,
  showButtons: PropTypes.bool,
};

Layout.defaultProps = {
  title: '',
  saveDisabled: false,
  saveMessage: null,
  save: () => {},
  showButtons: false,
};

export const EmptyLayout = ({ children }) => (<>{children}</>);

EmptyLayout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
