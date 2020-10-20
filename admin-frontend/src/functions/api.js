import { BASE_URL } from '../config';
import { BehaviorSubject } from 'rxjs';

export const currentUserObservable = new BehaviorSubject(null);

export const authenticate = formFields => {
  return new Promise((resolve, reject) => {
    fetch(
      `${BASE_URL}/login`,
      {
        method: 'post',
        body: JSON.stringify(formFields),
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json',
        }
      }
    )
      .then(response => {
        if (`${response.status}` === '200') {
          response.json().then(user => {
            resolve(user)
          });
        } else {
          response.json().then(reject);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const authFetch = (url, opts = {}) =>
  fetch(`${BASE_URL}${url}`, {
    ...opts, headers: {
      ...opts.headers,
      Authorization: `Bearer ${currentUserObservable.value.token}`,
      'content-type': 'application/json',
      accept: 'application/json'
    }
  });
