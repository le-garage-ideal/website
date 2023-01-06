import { Car } from "../types/car";

const GARAGE_PREFIX = 'garage-';

export const buildGarageName = (cars: Array<Car | undefined>) => {
  const garageSuffix = cars
    .filter(car => !!car)
    .map((car) => car!.model.name)
    .join('/');
  return `${GARAGE_PREFIX}${garageSuffix}`
};

export const getSavedGarages = () => {
  const savedGarages = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const garageName = localStorage.key(i);
    if (garageName && garageName.startsWith(GARAGE_PREFIX)) {
      const storedGarage = localStorage.getItem(garageName);
      if (storedGarage) {
        const garage = JSON.parse(storedGarage);
        savedGarages.push(garage);
      }
    }
  }
  return savedGarages;
};

export const save = (cars: Array<Car | undefined>) => {
  const garageName = buildGarageName(cars);
  const serialized = JSON.stringify(cars);
  localStorage.setItem(garageName, serialized);
  return garageName;
};

export const shouldSave = (cars: Array<Car | undefined>) => {
  if (cars && cars.length > 0 && cars.some(car => !!car)) {
    const garageName = buildGarageName(cars);
    const garageJson = localStorage.getItem(garageName);
    if (!garageJson) {
      return true;
    }
    if (garageJson) {
      const garage = JSON.parse(garageJson);
      if (garage.length !== cars.length) {
        return true;
      }
      return cars.some((car, idx) => car && (
        !garage[idx]
        || car.id !== garage[idx].id
        || car.label !== garage[idx].label
      ));
    }
  }
  return false;
};
