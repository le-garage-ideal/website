import { BASE_URL } from '../config';

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
        'accept': 'application/json'
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
    }).then(response => response.json())
    .then(deletedCar => console.log(deletedCar));
     
};
