import { PropsWithChildren } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Menu from '../components/menu/menu';
import layoutStyles from './layout.module.scss';
import { languages } from '../i18n/settings';
import { useTranslation } from '../i18n';
import { I18nParamsType } from '../../types/i18n';

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

export default async function FullLayout ({ children, params: { lng } }: PropsWithChildren<I18nParamsType>) {
  const { t: i18n } = await useTranslation(lng, 'common');
  const i18nArray = {
    'components.menu.saved_garages': i18n('components.menu.saved_garages'),
    'components.menu.about': i18n('components.menu.about'),
    'components.menu.cars': i18n('components.menu.cars'),
    'components.menu.the_garage': i18n('components.menu.the_garage'),
    'components.menu.current_garage': i18n('components.menu.current_garage'),
    'components.menu.garages': i18n('components.menu.garages'),
  };
  
  const footer = (
    <footer className={layoutStyles.appFooter}>
      <span suppressHydrationWarning>{i18n('components.layout.footer')}</span>
    </footer>
  );

  return (
    <>
      <div className={layoutStyles.overlay} />
      <div id="background" className={layoutStyles.background} />
      <div className={layoutStyles.appContainer}>
        <header className={layoutStyles.appHeader}>
          <div className={layoutStyles.menu}>
            <Menu i18n={i18nArray} />
          </div>
        </header>

        <main className={layoutStyles.appBody}>
          {children}
        </main>
        { footer }
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}
