import Uri from 'jsuri';
import { eachCar } from './cars';

export const extractHostname = fullHost => {
  let imageOrigin = null;
  if (fullHost) {
    const indexOfLastDot = fullHost.lastIndexOf('.');
    if (indexOfLastDot >= 0) {
      const tld = fullHost.substr(indexOfLastDot);
      const domainName = fullHost.substr(0, indexOfLastDot);
      const indexOfSecondDot = domainName.lastIndexOf('.');
      let hostname = null;
      if (indexOfSecondDot >= 0) {
        hostname = domainName.substr(indexOfSecondDot + 1);
      } else {
        hostname = domainName;
      }
      imageOrigin = `${hostname}${tld}`;
    }
  }
  return imageOrigin;
};

// When URL contains car edit params from previous car select page:
//  - add the selected car to URL
//  - clear edit params
//  - return true
export const processEditParams = uri => {
  const editParam = uri.getQueryParamValue('edit');
  const carParam = uri.getQueryParamValue('car');
  if (editParam && carParam) {
    uri.deleteQueryParam('edit');
    uri.deleteQueryParam('car');
    uri.replaceQueryParam(`car${editParam}`, carParam);
    return true;
  }
  return false;
};

const labelKey = carKey => `${carKey}-label`;

export const getCarParams = uri => {
  const result = eachCar(carKey => ({
    carId: uri.getQueryParamValue(carKey),
    carLabel: uri.getQueryParamValue(labelKey(carKey)),
  }))
  .map(element => element.carId ? element : null);
  return result;
};

export const addCarsToParams = (cars, uri) => {
  const newUri = new Uri(uri.toString())
  eachCar((carKey, idx) => {
    if (cars[idx]) {
      newUri.replaceQueryParam(carKey, cars[idx].mongodb_id);
      newUri.replaceQueryParam(labelKey(carKey), cars[idx].label);
    }
  });
  return newUri;
};

