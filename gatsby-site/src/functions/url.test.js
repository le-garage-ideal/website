import Uri from 'jsuri';
import { addCarsToParams, getCarParams } from './url';

describe('getCarParams', () => {
  it('returns query params from URL', () => {
    const uri = new Uri('http://test.com?car1=123456&car1-label=daily&car3=56789&car3-label=good%20car');
    const result = getCarParams(uri);
    expect(result).toHaveLength(3);
    expect(result[0].carId).toBe('123456');
    expect(result[0].carLabel).toBe('daily');
    expect(result[1]).toBeNull();
    expect(result[2].carId).toBe('56789');
    expect(result[2].carLabel).toBe('good car');
  });
});

describe('getRelativePath', () => {
  it('builds absolute path and retrieve relative path', () => {
    const relative = '/car/1?param=2';
    const uri = new Uri(`http://www.test.com:8082${relative}`);
    uri.setHost(null);
    uri.setProtocol(null);
    uri.setPort(null);
    expect(uri.toString()).toBe(relative);
  });
});

describe('addCarsToParams', () => {
  it('adds query params to URL from car data', () => {
    const uri = new Uri('http://test.com');
    const id = '88888';
    const title = 'good car';
    const result = addCarsToParams([{id, title}], uri);
    const params = getCarParams(result);
    expect(params[0].carId).toBe(id);
    expect(params[0].carLabel).toBe(title);
  });
});

