import Uri from 'jsuri';
import { redirect, RedirectType } from 'next/navigation';
import { StrapiResponseType, fetchPrice } from '../../functions/api';
import { fullname } from '../../functions/cars';
import { processEditParams, getCarParams } from '../../functions/url';
import { Car } from '../../types/car';
import { Card } from '../components/car/card';
import { Title } from '../components/title/title';
import { TopButtons } from '../components/topButtons/topButtons';

import indexStyles from './page.module.scss';
import qs from 'qs';

type IndexProps = {
  i18nArray: { [s: string]: string };
  allCars: StrapiResponseType<Array<Car>>;
  lng: string;
  searchParams: URLSearchParams;
}
export const Index = async ({ i18nArray, allCars, lng, searchParams }: IndexProps) => {
  // Retrieve URL params and set uri state, push new params to browser location
  let cars: Array<Car | undefined> = [];
  let uri;
  
  const queryString = qs.stringify(searchParams);
  const pathname = lng;
  const relativePathWithParams = `${pathname}${queryString}`;
  const initUri = new Uri(relativePathWithParams);

  // if edit=X parameter, save car to carX parameter
  const paramsChanged = processEditParams(initUri);
  if (paramsChanged) {
    let query = initUri.query();
    if (query.charAt(0) === '?') {
      query = query.slice(1);
    }
    redirect(`${initUri.path}?${query}`, RedirectType.replace);
  }
  uri = initUri;

  // Retrieve cars data and set cars state
  const carsInit: Array<Car | undefined> = [];
  const carParams = getCarParams(uri);
  if (carParams.length > 0) {
    // add missing params + save state
    // Priority to URL if user copy paste shared garage
    const carParams = getCarParams(uri);
    carParams.forEach((param, idx) => {
      carsInit[idx] = undefined;

      if (param?.carId) {
        const { carId, carLabel } = param;
        const carIdNumber = parseInt(carId);
        if (!isNaN(carIdNumber)) {
          const foundCar = allCars.data
            .find((car) => car.id === carIdNumber) as Car;

          if (foundCar) {
            foundCar.label = fullname(foundCar);
            carsInit[idx] = foundCar;
          }
        }
      }
    });

    if (carsInit.length > 0) {
      cars = carsInit;
    }
  }

  
  // Click on edit button on a car's card 
  const carElements = [];
  let index = 1;
  for (const car of cars) {
    const { price, barPriceStyle } = await fetchPrice(car);
    const element = (
      <Card
        key={`card-${car ? car.id : index}`}
        marginCard={index === 2}
        car={car}
        index={index}
        price={price}
        barPriceStyle={barPriceStyle}
        lng={lng}
      />
    );
    carElements.push(element);
    index += 1;
  }

  return (
    <>
      <TopButtons i18n={i18nArray} cars={cars} />
      <section className={indexStyles.mainSection}>
        <Title i18n={i18nArray} />
        <article className={indexStyles.carsContainer}>
          {carElements}
        </article>
      </section>
    </>
  );
};
