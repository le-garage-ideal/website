import Uri from 'jsuri';
import { eachCar } from './cars';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export const extractRelativePathWithParams = (uri: Uri) => {
  const uriClone = uri.clone();
  uriClone.setHost('');
  uriClone.setProtocol('');
  uriClone.setPort(0);
  return uriClone.toString();
};

export const labelKey = (carKey: string) => `${carKey}-label`;

export const getCarParams = (uri: Uri | undefined) => eachCar(carKey => {
    const result = {
      carId: uri?.getQueryParamValue(carKey),
      carLabel: uri?.getQueryParamValue(labelKey(carKey)),
    };
    return result;
  })
  .map(element => element.carId ? element : null);

export const addCarsToParams = (cars: Array<{ id: string | number; label?: string } | undefined>, uri: Uri) => {
  const newUri = uri.clone();
  eachCar((carKey, idx) => {
    const car = cars[idx];
    if (car) {
      newUri.replaceQueryParam(carKey, car.id);
      if (car.label) {
        newUri.replaceQueryParam(labelKey(carKey), car.label);
      }
    }
  });
  return newUri;
};

