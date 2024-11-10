
import { useTranslation } from '../i18n';
import { Index } from './Index';
import { I18nParamsType } from '../../types/i18n';

export default async function IndexPage({ params, searchParams }: { searchParams: URLSearchParams } & I18nParamsType) {
  const { lng } = await params;
  const { t: i18n } = await useTranslation(lng, 'common');

  const i18nArray = [
    'components.layout.saved_button_tooltip_ko',
    'components.layout.saved_button_tooltip_ok',
    'components.layout.link_clipboard_ko',
    'components.layout.link_clipboard_ok',
    'components.layout.share_with_facebook',
    'components.layout.share_with_twitter',
    'components.layout.share_with_reddit',
    'components.layout.share_title',
    'components.layout.link_share_it',
    'components.layout.share_link',
    'components.title.subtitle',
    'components.title.title',
    'pages.index.garage_saved',
    'pages.index.meta.description',
    'components.spec.price',
    'components.spec.ratio',
    'components.spec.power',
    'components.spec.hp',
    'components.spec.official_weight',
    'components.spec.observed_weight',
  ].reduce((obj, s) => {
    obj[s] = i18n(s);
    return obj;
  }, {} as { [s: string]: string });

  return <Index i18nArray={i18nArray} lng={lng} searchParams={searchParams} />;
}


