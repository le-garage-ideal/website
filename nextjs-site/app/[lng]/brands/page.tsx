import { Brand } from '../../../types/brand';
import { fetchStrapi, LIMIT_BRANDS_PARAMS, StrapiResponseType } from '../../../functions/api';
import { useTranslation } from '../../i18n';
import { BrandList } from './BrandList';
import { getLangFromPath } from '../../../functions/url';
import { headers } from 'next/headers';

type BrandsProps = {
  params: {
    brands: StrapiResponseType<Array<Brand>>;
    lng: string;
  }
};
export default async function Brands() {
  const lng = headers().get('x-lng') as string;
  const { t: i18n } = await useTranslation(lng, 'common');
  const brands = await fetchStrapi<Array<Brand>>(`brands?populate=*&${LIMIT_BRANDS_PARAMS}`);
  return <BrandList brands={brands.data} title={i18n('pages.brands.list_title') } />;
}
