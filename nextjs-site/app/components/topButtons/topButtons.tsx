"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
} from 'react-share';

import { Toast } from '../toast/toast';
import { useLocation } from '../../hooks/useLocation';
import topButtonsStyles from './topButtons.module.scss';

const BUTTON_HEIGHT = '40px';

type TopButtonsProps = {
  save?: () => void;
  saveDisabled?: boolean;
  saveMessage?: string;
  showButtons?: boolean;
  i18n: { [s: string]: string };
};
export const TopButtons = ({
  save,
  saveDisabled = false,
  saveMessage,
  showButtons = false,
  i18n,
}: TopButtonsProps) => {
  const {location} = useLocation();

  const [shareModalState, setShareModalState] = useState('');
  const [shareCopySuccessMessage, setShareCopySuccessMessage] = useState<string | null>(null);
  const [shareCopyErrorMessage, setShareCopyErrorMessage] = useState<string | null>(null);

  const shareCopyRef = useRef<HTMLInputElement>();
  const onShareCopyClick = () => {
    if (location) {
      try {
        shareCopyRef.current?.select();
        shareCopyRef.current?.setSelectionRange(0, 99999);
        document.execCommand('copy');
        setShareCopySuccessMessage(i18n['components.layout.link_clipboard_ok']);
        setTimeout(() => setShareCopySuccessMessage(null), 1000);
      } catch (e) {
        setShareCopyErrorMessage(i18n['components.layout.link_clipboard_ko']);
        setTimeout(() => setShareCopyErrorMessage(null), 1000);
      }
    }
  };

  const savedButtonTooltip = saveDisabled
    ? i18n['components.layout.saved_button_tooltip_ok']
    : i18n['components.layout.saved_button_tooltip_ko'];

  const shareWithLabelFacebook = i18n['components.layout.share_with_facebook'];
  const shareWithLabelTwitter = i18n['components.layout.share_with_twitter'];
  const shareWithLabelReddit = i18n['components.layout.share_with_reddit'];


  return (
    <>
      {showButtons
        && (
        <div className={topButtonsStyles.shareButtonsBar}>
          <button
            type="button"
            title={savedButtonTooltip}
            className={['icon-button', topButtonsStyles.saveButton].join(' ')}
            onClick={() => { if (save) save(); }}
            style={{ height: BUTTON_HEIGHT }}
          >
            {!saveDisabled && <span className={topButtonsStyles.saveButtonIndicator}>·</span>}
            <FontAwesomeIcon icon="save" />
          </button>
          <button
            type="button"
            title={i18n['components.layout.share_link']}
            className={['icon-button', topButtonsStyles.customShareButton].join(' ')}
            onClick={() => { setShareModalState('is-active'); }}
            style={{ height: BUTTON_HEIGHT }}
          >
            <FontAwesomeIcon icon="share-square" />
          </button>
          <div title={shareWithLabelFacebook}>
            <FacebookShareButton
              quote={i18n['components.layout.share_title']}
              url={location ?? ''}
            >
              <FacebookIcon size={BUTTON_HEIGHT} />
            </FacebookShareButton>
          </div>
          <div title={shareWithLabelTwitter}>
            <TwitterShareButton
              title={i18n['components.layout.share_title']}
              url={location ?? ''}
            >
              <TwitterIcon size={BUTTON_HEIGHT} />
            </TwitterShareButton>
          </div>
          <div title={shareWithLabelReddit}>
            <RedditShareButton
              title={i18n['components.layout.share_title']}
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

      <div className={['modal', shareModalState].join(' ')}>
        <div className="modal-background" />
        <div className="modal-content">
          <div className="field is-vertical">
            <label suppressHydrationWarning className="label has-text-light" htmlFor="share-link">
              { i18n['components.layout.link_share_it']}
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
    </>
  );
};
