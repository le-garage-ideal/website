import { Car } from '../../../../types/car';
import {
  fetchStrapi,
  LIMIT_CARS_PER_MODEL_PARAMS,
  POPULATE_CARS_PARAMS} from '../../../../functions/api';
import { Model } from '../../../../types/model';
import { useTranslation } from '../../../i18n';
import { CarList } from './CarList';
import { I18nParamsType } from '../../../../types/i18n';

type CarsProps = {
  params: {
    model: string;
  }
};
export default async function Cars({ params }: CarsProps & I18nParamsType) {
  const model = await fetchStrapi<Model>(`models/${params.model}?populate=*`);
  if (!model) {
    throw new Error(`No model for [model] param ${params.model}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&filters[model][id][$eqi]=${params.model}&${LIMIT_CARS_PER_MODEL_PARAMS}`);
  if (!model) {
    throw new Error(`No car for [model] param ${params.model}`);
  }

  const { t: i18n } = await useTranslation(params.lng, 'common');

  const title = i18n('templates.cars.title')
    .replace('{brand}', model.data.brand.name.toUpperCase())
    .replace('{model}', model.data.name.toUpperCase());

  return (
    <CarList cars={cars.data} title={title} lng={params.lng} />
  );
};
