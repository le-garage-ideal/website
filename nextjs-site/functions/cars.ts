import { createContext } from 'react';
import { Car } from '../types/car';

export type CarsType = Array<Car | undefined>;
export type CarsContextType = [CarsType, (c: CarsType) => void];
export const CarsContext = createContext<CarsContextType>([[], () => {}]);

type EachCarIndexParam = (i: number) => unknown;
export const eachCarIndex = (fn: EachCarIndexParam) => {
  const result = [];
  for (let i = 0; i < 3; i += 1) {
    result.push(fn(i));
  }
  return result;
};

type EachCarParam = (keyParam: string, i: number) => unknown;
export const eachCar = (fn: EachCarParam) => eachCarIndex(i => fn(`car${i + 1}`, i));

export const fullname = (car: Car) => `${car.model.brand.name} ${car.variant}`;
