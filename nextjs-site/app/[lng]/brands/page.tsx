import { Brand } from '../../../types/brand';
import { fetchStrapi, LIMIT_BRANDS_PARAMS } from '../../../functions/api';
import { useTranslation } from '../../i18n';
import { BrandList } from './BrandList';
import { I18nParamsType } from '../../../types/i18n';

export default async function Brands({ params }: I18nParamsType) {
  const { t: i18n } = await useTranslation(params.lng ?? 'en', 'common');
  const brands = await fetchStrapi<Array<Brand>>(`brands?populate=*&${LIMIT_BRANDS_PARAMS}`);
  return <BrandList brands={brands.data} title={i18n('pages.brands.list_title') } lng={params.lng} />;
}
