"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
} from 'react-share';
import { faSave, faShareSquare } from '@fortawesome/free-solid-svg-icons';
import Uri from 'jsuri';

import { Toast } from '../toast/toast';
import { Car } from '../../../types/car';
import { addCarsToParams } from '../../../functions/url';
import { buildGarageName, save } from '../../../functions/storage';
import { useLocation } from '../../hooks/useLocation';
import topButtonsStyles from './topButtons.module.scss';

const BUTTON_HEIGHT = '40px';

type TopButtonsProps = {
  cars?: Array<Car | undefined>;
  i18n: { [s: string]: string };
};
export const TopButtons = ({ cars, i18n }: TopButtonsProps) => {
  const [saveState, setSaveState] = useState<{saveMessage: string | undefined; saveOk: boolean;}>({
    saveMessage: undefined,
    saveOk: true,
  });
  const { saveOk, saveMessage } = saveState;

  const { replace } = useRouter();

  useEffect(() => {
    if (localStorage && cars) {
      const currentGarageName = buildGarageName(cars);
      const garageExist = !!localStorage.getItem(currentGarageName);
      setSaveState({ saveOk: garageExist, saveMessage: undefined });
    }
  }, [cars]);

  // Click on garage save button
  const onSave = () => {
    if (cars && !saveOk) {
      const garageName = save(cars);
      const newUri = addCarsToParams(cars, new Uri(location));
      const savedMessage = i18n['pages.index.garage_saved'];
      setSaveState({ saveOk: true, saveMessage: `${savedMessage} "${garageName}"` });
      replace(newUri.toString());
      setTimeout(() => setSaveState({ saveOk: true, saveMessage: undefined }), 2000); // message will be displayed during 2s
    }
  };

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

  const savedButtonTooltip = saveOk
    ? i18n['components.layout.saved_button_tooltip_ok']
    : i18n['components.layout.saved_button_tooltip_ko'];

  const shareWithLabelFacebook = i18n['components.layout.share_with_facebook'];
  const shareWithLabelTwitter = i18n['components.layout.share_with_twitter'];
  const shareWithLabelReddit = i18n['components.layout.share_with_reddit'];

  const { location } = useLocation();

  return (
    <>
      <div className={topButtonsStyles.shareButtonsBar}>
        <button
          type="button"
          title={savedButtonTooltip}
          className={['icon-button', topButtonsStyles.saveButton].join(' ')}
          onClick={onSave}
          style={{ height: BUTTON_HEIGHT }}
        >
          {!saveOk && <span className={topButtonsStyles.saveButtonIndicator}>•</span>}
          <FontAwesomeIcon icon={faSave} />
        </button>
        <button
          type="button"
          title={i18n['components.layout.share_link']}
          className={['icon-button', topButtonsStyles.customShareButton].join(' ')}
          onClick={() => { setShareModalState('is-active'); }}
          style={{ height: BUTTON_HEIGHT }}
        >
          <FontAwesomeIcon icon={faShareSquare} />
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
              <Toast classNames={[]}>{saveMessage}</Toast>
            </div>
          )}
      </div>

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
            <button
              type="button"
              className="button"
              aria-label="close"
              onClick={() => setShareModalState('')}
            >
              Fermer
            </button>
            {shareCopySuccessMessage && <Toast classNames={['is-success']}>{shareCopySuccessMessage}</Toast>}
            {shareCopyErrorMessage && <Toast classNames={['is-error']}>{shareCopyErrorMessage}</Toast>}
          </div>
        </div>
      </div>
    </>
  );
};
