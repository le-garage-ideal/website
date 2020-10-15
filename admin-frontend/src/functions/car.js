import { BASE_URL } from '../config';
import { sortCars } from './sort';

export const noCarImageMatch = carId => {
    return fetch(BASE_URL + '/cars/favcars/' + carId, {
        method: 'delete',
        headers: {
        'accept': 'application/json'
        }
    }).then(response => response.json());
};

export const selectCarImage = (carId, variantName, url) => {
    return fetch(BASE_URL + '/cars', {
      method: 'put',
      body: JSON.stringify({ carId, variantName, url }),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    }).then(response => response.json());
};

export const createCar = car => {
    return fetch(BASE_URL + '/cars', {
      method: 'post',
      body: JSON.stringify(car),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      }
    }).then(response => response.json())
    .then(addedCar => console.log(addedCar));
};

export const removeCar = (carId) => {
    return fetch(BASE_URL + '/cars/' + carId, {
      method: 'delete',
      headers: {
        'accept': 'application/json'
      }
    }).then(response => console.log(response));
     
};

export const computeSelectedCars = (cars, selectedModel) => {
  return cars
    .filter(car => car.model.brand.name === selectedModel.brand.name && car.model.name === selectedModel.name)
    .sort(sortCars);
}
