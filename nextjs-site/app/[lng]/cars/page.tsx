import Uri from 'jsuri';
import { useRouter } from 'next/navigation';

import { sortCars } from '../../../functions/sort';
import { useLocation } from '../../hooks/useLocation';
import { Car } from '../../../types/car';
import { fetchStrapi, LIMIT_CARS_PARAMS, POPULATE_CARS_PARAMS } from '../../../functions/api';
import { useTranslation } from '../../i18n';
import { CarList } from './CarList';

type CarsProps = {
  params: {
    lng: string;
  }
};
export default async function Cars({ params }: CarsProps) {
  const { lng } = await params;
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&${LIMIT_CARS_PARAMS}`);
  const completeCarList = cars.data.sort(sortCars);

  const { t: i18n } = await useTranslation(lng, 'common');
  const i18nArray = [
    'pages.cars.list_title',
    'pages.cars.add_to_garage_tooltip',
  ].reduce((obj, s) => {
    obj[s] = i18n(s);
    return obj;
  }, {} as { [s: string]: string });

  return <CarList cars={completeCarList} i18nArray={i18nArray} numberOfCars={cars.meta.pagination.total} lng={lng} />;
}
