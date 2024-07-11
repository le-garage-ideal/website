import { PropsWithChildren } from 'react';
import "@fortawesome/fontawesome-svg-core/styles.css";

import Menu from '../components/menu/menu';
import { languages } from '../i18n/settings';
import { useTranslation } from '../i18n';
import { I18nParamsType } from '../../types/i18n';
import './global.scss';


export default async function RootLayout ({ children, params: { lng } }: PropsWithChildren<I18nParamsType>) {
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
    <footer className="appFooter">
      <span suppressHydrationWarning>{i18n('components.layout.footer')}</span>
    </footer>
  );

  return (
    <html lang="en">
      <body>
        <div className="appContainer">
          <div className="overlay" />
          <div id="background" className="background" />
          <header className="appHeader">
            <div className="menu">
              <Menu lng={lng} i18nArray={i18nArray} />
            </div>
          </header>

          <main className="main">
            {children}
          </main>
          { footer }
        </div>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}
