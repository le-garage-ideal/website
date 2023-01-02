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

export const addProtocolAndHostToUri = (fullUri, relativeUri) => {
  const fullUriObj = typeof fullUri === 'string' ? new Uri(fullUri) : fullUri;
  const resultUriObj = typeof relativeUri === 'string' ? new Uri(relativeUri) : relativeUri.clone();
  resultUriObj.setProtocol(fullUriObj.protocol());
  resultUriObj.setHost(fullUriObj.host());
  resultUriObj.setPort(fullUriObj.port());
  return resultUriObj;
};

export const extractRelativePathWithParams = uri => {
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

export const getCarParams = uri => eachCar(carKey => ({
    carId: uri.getQueryParamValue(carKey),
    carLabel: uri.getQueryParamValue(labelKey(carKey)),
  }))
  .map(element => element.carId ? element : null);

export const addCarsToParams = (cars, uri) => {
  const newUri = uri.clone();
  eachCar((carKey, idx) => {
    if (cars[idx]) {
      newUri.replaceQueryParam(carKey, cars[idx].id);
      newUri.replaceQueryParam(labelKey(carKey), cars[idx].label);
    }
  });
  return newUri;
};

