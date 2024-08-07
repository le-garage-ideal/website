import { Car } from '../types/car';


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
  [`${car?.model?.brand?.name} ${car?.variant}`, car?.startYear].filter(Boolean).join(' - ');
