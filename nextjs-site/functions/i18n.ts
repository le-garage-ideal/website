import { createContext } from 'react';
import en from '../i18n/en.json' assert { type: "json" };
import fr from '../i18n/fr.json' assert { type: "json" };

export const getMessages = (locale: string) => {
  const file = locale?.includes("fr") ? fr : en;
  return flatten(file);
};

export const carLabels = (file: any, index: any): any => file[`label_${index}`];

const flatten = (obj: any) => {
  const flattenRecursive = (obj: object, parentProperty?: string, propertyMap: Record<string, unknown> = {}) => {
    for(const [key, value] of Object.entries(obj)){
      const property = parentProperty ? `${parentProperty}.${key}` : key;
      if(value && typeof value === 'object'){
        flattenRecursive(value, property, propertyMap);
      } else {
        propertyMap[property] = value;
      }
    }
    return propertyMap;
  };
  return flattenRecursive(obj);
};

export const I18nContext = createContext<any>({});

