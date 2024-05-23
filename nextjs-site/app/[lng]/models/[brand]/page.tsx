
import { sortModels } from '../../../../functions/sort';
import { Car } from '../../../../types/car';
import {
  fetchStrapi,
  LIMIT_BRANDS_PARAMS,
  LIMIT_MODELS_PER_BRAND_PARAMS,
  POPULATE_CARS_PARAMS,
  StrapiResponseType,
} from '../../../../functions/api';
import { Brand } from '../../../../types/brand';
import { Model } from '../../../../types/model';
import { useTranslation } from '../../../i18n';
import { BrandsList } from './brandsList';

type ModelsProps = {
  params: {
    lng: string;
    brand: StrapiResponseType<Brand>;
    cars: StrapiResponseType<Array<Car>>;
  };
};
export default async function Models({ params: { lng, brand, cars } }: ModelsProps) {
  const { t: i18n } = await useTranslation(lng, 'common');

  const listName: Array<Car> = cars
    .data
    .sort((a, b) => sortModels(a.model, b.model))
    .reduce((acc, el) => (
      acc[acc.length - 1] && acc[acc.length - 1].model.name === el.model.name ?
        acc
        :
        [...acc, el]
    ), new Array<Car>());

  const title = i18n('templates.models.title')
    .replace('{brand}', brand.data.name);

  const description = i18n('templates.models.description')
    .replace('{brand}', brand.data.name);

  return <BrandsList listName={listName} title={title} />;
};

export async function getStaticPaths() {
  const brands = await fetchStrapi<Array<Model>>(`brands?${LIMIT_BRANDS_PARAMS}`);
  return {
    paths: brands?.data.flatMap(brand => ([
      { params: { brand: `${brand.id}` }, locale: 'en' },
      { params: { brand: `${brand.id}` }, locale: 'fr' },
    ])),
    fallback: false, // can also be true or 'blocking'
  }
}

export async function generateStaticParams({ params }: { params: any }) {
  const brand = await fetchStrapi<Brand>(`brands/${params.brand}?populate=*`);
  if (!brand) {
    throw new Error(`No brand for [brand] param ${params.brand}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&filters[model][brand][id][$eq]=${brand.data.id}&${LIMIT_MODELS_PER_BRAND_PARAMS}`);
  if (!cars?.data.length) {
    throw new Error(`No cars for [brand] param ${params.brand}`);
  }
  return { brand, cars };
}

