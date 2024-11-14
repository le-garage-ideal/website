import { Car } from '../../../../types/car';
import {
  fetchStrapi,
  LIMIT_CARS_PER_MODEL_PARAMS,
  POPULATE_CARS_PARAMS} from '../../../../functions/api';
import { Model } from '../../../../types/model';
import { useTranslation } from '../../../i18n';
import { CarList } from './CarList';

type CarsProps = {
  params: Promise<{ model: string; lng: string; }>;
};
export default async function Cars({ params }: CarsProps) {
  const { lng, model: modelId } = await params;
  const model = await fetchStrapi<Model>(`models/${modelId}?populate=*`);
  if (!model) {
    throw new Error(`No model for [model] param ${modelId}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&filters[model][id][$eqi]=${modelId}&${LIMIT_CARS_PER_MODEL_PARAMS}`);
  if (!model) {
    throw new Error(`No car for [model] param ${modelId}`);
  }

  const { t: i18n } = await useTranslation(lng, 'common');

  const title = i18n('templates.cars.title')
    .replace('{brand}', model.data.brand.name.toUpperCase())
    .replace('{model}', model.data.name.toUpperCase());

  return (
    <CarList cars={cars.data} title={title} lng={lng} />
  );
};
