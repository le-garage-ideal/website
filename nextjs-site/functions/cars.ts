import { createContext } from 'react';
import { Car } from '../types/car';

export type CarsType = Array<Car | undefined>;
export type CarsContextType = [CarsType, (c: CarsType) => void];
export const CarsContext = createContext<CarsContextType>([[], () => {}]);

type EachCarIndexParam<T> = (i: number) => T;
export const eachCarIndex = <T> (fn: EachCarIndexParam<T>): Array<T> => {
  const result = [];
  for (let i = 0; i < 3; i += 1) {
    result.push(fn(i));
  }
  return result;
};

type EachCarParam<T> = (keyParam: string, i: number) => T;
export const eachCar = <T> (fn: EachCarParam<T>): Array<T> => eachCarIndex(i => fn(`car${i + 1}`, i));

export const fullname = (car: Car) =>
  `${car.model.brand.name} ${car.variant}`;
