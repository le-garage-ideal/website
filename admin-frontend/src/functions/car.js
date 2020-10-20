import { authFetch } from './api';
import { sortCars } from './sort';

export const fetchInitData = () => {
  return Promise.all([
    authFetch('/cars').then(res => res.json()),
    authFetch('/brands').then(res => res.json()),
    authFetch('/models').then(res => res.json())
  ]).then(processInitData);
}

export const processInitData = ([cars, brands, models]) => {
  const modelMap = {};
  const brandMap = {};
  for (const car of cars) {

    const brand = brands.find(brand => brand.name === car.model.brand.name);
    if (!brand) {
      console.log(`brand not found for car`, car);
    } else {
      if (!brandMap[brand._id]) brandMap[brand._id] = { totalCount: 0, okCount: 0 };
      brandMap[brand._id].totalCount++;
      if (car.selectedFavcarsUrl) {
        brandMap[brand._id].okCount++;
      }
    }

    const model = models.find(model => model.brand.name === car.model.brand.name && model.name === car.model.name);
    if (!model) {
      console.log(`model not found for car`, car);
    } else {
      if (!modelMap[model._id]) modelMap[model._id] = { totalCount: 0, okCount: 0 };
      modelMap[model._id].totalCount++;
      if (car.selectedFavcarsUrl) {
        modelMap[model._id].okCount++;
      }
    }
  }
  return { cars, models, brands, brandMap, modelMap };
};

export const noCarImageMatch = carId => {
  return authFetch('/cars/favcars/' + carId, {
        method: 'delete',
        headers: {
        'accept': 'application/json'
        }
    }).then(response => response.json());
};

export const selectCarImage = (carId, variantName, url) => {
  return authFetch('/cars', {
      method: 'put',
    body: JSON.stringify({ carId, variantName, url }),
    }).then(response => response.json());
};

export const createCar = car => {
  return authFetch('/cars', {
      method: 'post',
    body: JSON.stringify(car),
    }).then(response => response.json())
    .then(addedCar => console.log(addedCar));
};

export const removeCar = (carId) => {
  return authFetch('/cars/' + carId, {
    method: 'delete',
    }).then(response => console.log(response));
     
};

export const computeSelectedCars = (cars, selectedModel) => {
  return cars
    .filter(car => car.model.brand.name === selectedModel.brand.name && car.model.name === selectedModel.name)
    .sort(sortCars);
}
