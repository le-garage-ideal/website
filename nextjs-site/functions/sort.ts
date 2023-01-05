import { Car } from "../types/car";
import { Model } from "../types/model";

export const sortField = (a: any, b: any, field: string) => {
  if (!a[field] && !b[field]) {
    return 0;
  }
  if (!a[field]) {
    return -1;
  }
  if (!b[field]) {
    return 1;
  }
  if (a[field] === b[field]) {
    return 0;
  }
  return a[field] < b[field] ? -1 : 1;
};

export const sortCars = (x: Car, y: Car) => (
  sortField(x, y, 'startYear') === 0 ?
    sortField(x, y, 'variant')
    :
    sortField(x, y, 'startYear')
);

export const sortModels = (x: Model, y: Model) => (
  sortField(x.brand, y.brand, 'name') === 0 ?
    sortField(x, y, 'name')
    :
    sortField(x.brand, y.brand, 'name')
);
