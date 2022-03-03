const GARAGE_PREFIX = 'garage-';

export const buildGarageName = cars => {
  const garageSuffix = cars
    .filter(car => !!car)
    .map(car => car.model.name)
    .join('/');
  return `${GARAGE_PREFIX}${garageSuffix}`
};

export const getSavedGarages = () => {
  const savedGarages = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const garageName = localStorage.key(i);
    if (garageName.startsWith(GARAGE_PREFIX)) {
      const garage = JSON.parse(localStorage.getItem(garageName));
      savedGarages.push(garage);
    }
  }
  return savedGarages;
};

export const save = cars => {
  const garageName = buildGarageName(cars);
  const serialized = JSON.stringify(cars);
  localStorage.setItem(garageName, serialized);
  return garageName;
};

export const shouldSave = cars => {
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
        || car.mongodb_id !== garage[idx].mongodb_id
        || car.label !== garage[idx].label
      ));
    }
  }
  return false;
};
