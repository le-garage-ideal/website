export const save = cars => {
  const garageName = `garage-${cars.map(car => car.model.name).join('/')}`;
  const serialized = JSON.stringify(cars);
  localStorage.setItem(garageName, serialized);
  return garageName;
};
