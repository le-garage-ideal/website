import Uri from 'jsuri';
import { LIMIT_CARS_PARAMS, POPULATE_CARS_PARAMS, StrapiResponseType, fetchPrice, fetchStrapi } from '../../functions/api';
import { fullname } from '../../functions/cars';
import { getCarParams } from '../../functions/url';
import { Car } from '../../types/car';
import { Card } from '../components/car/card';
import { Title } from '../components/title/title';
import { TopButtons } from '../components/topButtons/topButtons';

import indexStyles from './page.module.scss';
import qs from 'qs';

type IndexProps = {
  i18nArray: { [s: string]: string };
  lng: string;
  searchParams: URLSearchParams;
}
export const Index = async ({ i18nArray, lng, searchParams }: IndexProps) => {
  // Retrieve URL params and set uri state, push new params to browser location
  let cars: Array<Car | undefined> = [];
  
  const queryString = qs.stringify(searchParams);
  const pathname = lng;
  const relativePathWithParams = `${pathname}?${queryString}`;
  const uri = new Uri(relativePathWithParams);

  // Retrieve cars data and set cars state
  const carsInit: Array<Car | undefined> = [];
  const carParams = getCarParams(uri);
  console.log('carParams.length', carParams.length);    
  if (carParams.length > 0) {
    const filters = carParams.filter(Boolean).map((param, i) => `filters[id][$in][${i}]=${param?.carId}`).join('&');
    const allCars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&${LIMIT_CARS_PARAMS}${filters ? `&${filters}` : ''}`) as StrapiResponseType<Array<Car>>;

    // add missing params + save state
    // Priority to URL if user copy paste shared garage
    carParams.forEach((param, idx) => {
      console.log('param idx', param, idx);    
      carsInit[idx] = undefined;

      if (param?.carId) {
        console.log('param?.carId', param?.carId);    
        const { carId } = param;
        const carIdNumber = parseInt(carId);
        if (!isNaN(carIdNumber)) {
          console.log('!isNaN(carIdNumber)', !isNaN(carIdNumber));    
          const foundCar = allCars.data
            .find((car) => car.id === carIdNumber) as Car;

          if (foundCar) {
            console.log('foundCar idx', foundCar, idx);
            
            foundCar.label = fullname(foundCar);
            carsInit[idx] = foundCar;
            console.log('Car found', foundCar.variant)
          } else {
            console.error('Car not found', carIdNumber)
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
        i18nArray={i18nArray}
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
