import { createContext } from 'react';

export const CarsContext = createContext()

export const eachCarIndex = fn => {
  const result = [];
  for (let i = 0; i < 3; i += 1) {
    result.push(fn(i));
  }
  return result;
};

export const eachCar = fn => eachCarIndex(i => fn(`car${i + 1}`, i));

export const fullname = car => `${car.model.brand.name} ${car.variant}`;
