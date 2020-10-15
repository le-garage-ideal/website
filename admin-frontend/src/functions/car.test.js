import { computeSelectedCars } from './car';
test('Compute selected cars correctly', () => {
  const model1 = {
    _id: 11,
    name: 'MODEL1',
    brand: {
      _id: 1,
      name: 'BRAND1',
    }
  };
  const model2 = {
    _id: 11,
    name: 'MODEL2',
    brand: {
      _id: 1,
      name: 'BRAND1',
    }
  };
  const car1 = { _id: 111, model: model1 }; 
  const car2 = { _id: 112, model: model1 }; 
  const car3 = { _id: 113, model: model1 }; 
  const car4 = { _id: 211, model: model2 }; 
  const car5 = { _id: 212, model: model2 }; 
  const cars = [car1, car2, car3, car4, car5];
  const result = computeSelectedCars(cars, model2);
  expect(result).toEqual(expect.arrayContaining([car4, car5]));
  expect(result).toEqual(expect.not.arrayContaining([car1, car2, car3]));
});
