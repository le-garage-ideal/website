import {describe, expect, it} from '@jest/globals';
import { formatStrapiObjects } from './api';
import { Car } from '../types/car';

describe('formatStrapiObjects', () => {
  it('removes attributes and data level from Strapi Car', () => {
    const strapiCar = {
      "id": 1,
      "attributes": {
          "variant": "507 ROADSTER",
          "model": {
              "data": {
                  "id": 482,
                  "attributes": {
                      "name": "507",
                  }
              }
          },
      }
    };
    const result = formatStrapiObjects<Car>(strapiCar);
    expect(result.id).toBe(strapiCar.id);
    expect(result.variant).toBe(strapiCar.attributes.variant);
    expect(result.model.id).toBe(strapiCar.attributes.model.data.id);
    expect(result.model.name).toBe(strapiCar.attributes.model.data.attributes.name);
  });
  it('does nothing to simple object', () => {
    const simpleObject = {
      "id": 1,
      "variant": "507 ROADSTER",
    };
    const result = formatStrapiObjects<{id: string; variant: string}>(simpleObject);
    expect(result.id).toBe(1);
    expect(result.variant).toBe("507 ROADSTER");
  });
});



