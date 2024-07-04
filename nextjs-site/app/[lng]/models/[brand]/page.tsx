
import { sortModels } from '../../../../functions/sort';
import { Car } from '../../../../types/car';
import {
  fetchStrapi,
  LIMIT_MODELS_PER_BRAND_PARAMS,
  POPULATE_CARS_PARAMS,
} from '../../../../functions/api';
import { Brand } from '../../../../types/brand';
import { useTranslation } from '../../../i18n';
import { ModelList } from './modelList';

export default async function Models({ params }: { params: { lng: string; brand: string }}) {
  const { t: i18n } = await useTranslation(params.lng ?? 'en', 'common');

  const brand = await fetchStrapi<Brand>(`brands/${params.brand}?populate=*`);
  if (!brand) {
    throw new Error(`No brand for [brand] param ${params.brand}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&filters[model][brand][id][$eq]=${brand.data.id}&${LIMIT_MODELS_PER_BRAND_PARAMS}`);
  if (!cars?.data.length) {
    throw new Error(`No cars for [brand] param ${params.brand}`);
  }

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

  return <ModelList listName={listName} title={title} />;
};
