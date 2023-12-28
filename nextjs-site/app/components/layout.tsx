'use client';

import React, { PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation} from 'next-i18next';
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

import { useLocation } from '../hooks/useLocation';

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
  uri: string | undefined;
  save?: () => void;
  saveDisabled?: boolean;
  saveMessage?: string;
  showButtons?: boolean;
};
export const FullLayout = ({
  uri,
  children,
  save,
  saveDisabled = false,
  saveMessage,
  showButtons = false,
}: PropsWithChildren<LayoutProps>) => {
  const { t: i18n } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [shareModalState, setShareModalState] = useState('');
  const [shareCopySuccessMessage, setShareCopySuccessMessage] = useState<string | null>(null);
  const [shareCopyErrorMessage, setShareCopyErrorMessage] = useState<string | null>(null);
  const menuButtonClass = [layoutStyles.menuButton, 'icon-button'];
  if (showMenu) {
    menuButtonClass.push(layoutStyles.menuExpanded);
  }

  const {location} = useLocation();

  const shareCopyRef = useRef<HTMLInputElement>();
  const onShareCopyClick = () => {
    if (location) {
      try {
        shareCopyRef.current?.select();
        shareCopyRef.current?.setSelectionRange(0, 99999);
        document.execCommand('copy');
        setShareCopySuccessMessage(i18n('components.layout.link_clipboard_ok'));
        setTimeout(() => setShareCopySuccessMessage(null), 1000);
      } catch (e) {
        setShareCopyErrorMessage(i18n('components.layout.link_clipboard_ko'));
        setTimeout(() => setShareCopyErrorMessage(null), 1000);
      }
    }
  };

  const savedButtonTooltip = saveDisabled
    ? i18n('components.layout.saved_button_tooltip_ok')
    : i18n('components.layout.saved_button_tooltip_ko');

  const footer = (
    <footer className={layoutStyles.appFooter}>
      <span suppressHydrationWarning>{i18n('components.layout.footer')}</span>
    </footer>
  );

  const shareWithLabelFacebook = i18n('components.layout.share_with', { network: 'Facebook' }) as string;
  const shareWithLabelTwitter = i18n('components.layout.share_with', { network: 'Twitter' }) as string;
  const shareWithLabelReddit = i18n('components.layout.share_with', { network: 'Reddit' }) as string;

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
                title={i18n('components.layout.share_link')}
                className={['icon-button', layoutStyles.customShareButton].join(' ')}
                onClick={() => { setShareModalState('is-active'); }}
                style={{ height: BUTTON_HEIGHT }}
              >
                <FontAwesomeIcon icon="share-square" />
              </button>
              <div title={shareWithLabelFacebook}>
                <FacebookShareButton
                  quote={i18n('components.layout.share_title')}
                  url={location ?? ''}
                >
                  <FacebookIcon size={BUTTON_HEIGHT} />
                </FacebookShareButton>
              </div>
              <div title={shareWithLabelTwitter}>
                <TwitterShareButton
                  title={i18n('components.layout.share_title')}
                  url={location ?? ''}
                >
                  <TwitterIcon size={BUTTON_HEIGHT} />
                </TwitterShareButton>
              </div>
              <div title={shareWithLabelReddit}>
                <RedditShareButton
                  title={i18n('components.layout.share_title')}
                  url={location ?? ''}
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
              <label suppressHydrationWarning className="label has-text-light" htmlFor="share-link">
                { i18n('components.layout.link_share_it')}
              </label>
              <div className="control">
                <input
                  type="text"
                  name="share-link"
                  id="share-link"
                  value={location ?? ''}
                  className="input is-primary"
                  readOnly
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', height: '80px'}}>
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
