
import { Car } from '../../types/car';
import {
  fetchStrapi,
  LIMIT_CARS_PARAMS,
  POPULATE_CARS_PARAMS
} from '../../functions/api';
import { useTranslation } from '../i18n';
import { Index } from './Index';
import { I18nParamsType } from '../../types/i18n';

export default async function IndexPage({ params: { lng }, searchParams }: { searchParams: URLSearchParams } & I18nParamsType) {
  const { t: i18n } = await useTranslation(lng, 'common');

  const i18nArray = {
    'components.layout.saved_button_tooltip_ko': i18n('components.layout.saved_button_tooltip_ko'),
    'components.layout.saved_button_tooltip_ok': i18n('components.layout.saved_button_tooltip_ok'),
    'components.layout.link_clipboard_ko': i18n('components.layout.link_clipboard_ko'),
    'components.layout.link_clipboard_ok': i18n('components.layout.link_clipboard_ok'),
    'components.layout.share_with_facebook': i18n('components.layout.share_with_facebook'),
    'components.layout.share_with_twitter': i18n('components.layout.share_with_twitter'),
    'components.layout.share_with_reddit': i18n('components.layout.share_with_reddit'),
    'components.layout.share_title': i18n('components.layout.share_title'),
    'components.layout.link_share_it': i18n('components.layout.link_share_it'),
    'components.layout.share_link': i18n('components.layout.share_link'),
    'components.title.subtitle': i18n('components.title.subtitle'),
    'components.title.title': i18n('components.title.title'),
    'pages.index.garage_saved': i18n('pages.index.garage_saved'),
    'pages.index.meta.description': i18n('pages.index.meta.description'),
  };

  return <Index i18nArray={i18nArray} lng={lng} searchParams={searchParams} />;
}


