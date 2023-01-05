import Uri from 'jsuri';
import { Car } from '../types/car';
import { eachCar } from './cars';

export const extractHostname = (fullHost: string) => {
  let imageOrigin = null;
  if (fullHost) {
    const indexOfLastDot = fullHost.lastIndexOf('.');
    if (indexOfLastDot >= 0) {
      const tld = fullHost.substring(indexOfLastDot);
      const domainName = fullHost.substring(0, indexOfLastDot);
      const indexOfSecondDot = domainName.lastIndexOf('.');
      let hostname = null;
      if (indexOfSecondDot >= 0) {
        hostname = domainName.substring(indexOfSecondDot + 1);
      } else {
        hostname = domainName;
      }
      imageOrigin = `${hostname}${tld}`;
    }
  }
  return imageOrigin;
};

export const addProtocolAndHostToUri = (fullUri: string, relativeUri: string | Uri) => {
  const fullUriObj = typeof fullUri === 'string' ? new Uri(fullUri) : fullUri;
  const resultUriObj = typeof relativeUri === 'string' ? new Uri(relativeUri) : relativeUri.clone();
  resultUriObj.setProtocol(fullUriObj.protocol());
  resultUriObj.setHost(fullUriObj.host());
  resultUriObj.setPort(fullUriObj.port());
  return resultUriObj;
};

export const extractRelativePathWithParams = (uri: Uri) => {
  const uriClone = uri.clone();
  uriClone.setHost(null);
  uriClone.setProtocol(null);
  uriClone.setPort(null);
  return uriClone.toString();
};

// When URL contains car edit params from previous car select page:
//  - add the selected car to URL
//  - clear edit params
//  - return true
export const processEditParams = (uri: Uri) => {
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

const labelKey = (carKey: string) => `${carKey}-label`;

export const getCarParams = (uri: Uri) => eachCar(carKey => ({
    carId: uri.getQueryParamValue(carKey),
    carLabel: uri.getQueryParamValue(labelKey(carKey)),
  }))
  .map(element => element.carId ? element : null);

export const addCarsToParams = (cars: Array<Car>, uri: Uri) => {
  const newUri = uri.clone();
  eachCar((carKey, idx) => {
    if (cars[idx]) {
      newUri.replaceQueryParam(carKey, cars[idx].id);
      newUri.replaceQueryParam(labelKey(carKey), cars[idx].label);
    }
  });
  return newUri;
};

