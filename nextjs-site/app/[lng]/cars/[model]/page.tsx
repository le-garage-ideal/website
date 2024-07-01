"use client";

import { useState } from 'react';
import Uri from 'jsuri';
import { useRouter } from 'next/navigation';

import FilteredList from '../../../components/filtered-list/filtered-list';
import ListItem from '../../../components/filtered-list/list-item';
import { sortCars } from '../../../../functions/sort';
import { extractRelativePathWithParams } from '../../../../functions/url';
import { Car } from '../../../../types/car';
import { useLocation } from '../../../hooks/useLocation';
import {
  fetchStrapi,
  LIMIT_CARS_PER_MODEL_PARAMS,
  LIMIT_MODELS_PARAMS,
  POPULATE_CARS_PARAMS,
  StrapiResponseType
} from '../../../../functions/api';
import { Model } from '../../../../types/model';
import { I18nParamsType } from '../../../../types/i18n';
import { useTranslation } from '../../../i18n';

type CarsProps = {
  params: {
    model: StrapiResponseType<Model>;
    cars: StrapiResponseType<Array<Car>>;
    lng: string;
  }
};
export default async function Cars({ params: { model, cars, lng } }: CarsProps) {
  const { push } = useRouter();
  const {location} = useLocation();
  const { t: i18n } = await useTranslation(lng, 'common');

  const uri = new Uri(location);
  const completeCarList: Array<Car> = cars.data.sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList);

  const carComponents = filteredCars.map(car => {
    const name = car.variant + (car.startYear ? ` - ${car.startYear}` : '');
    return (
      <li key={car.id}>
        <ListItem
          id={car.id}
          name={name}
          image={car.imageFile?.formats?.thumbnail?.url ?? car.imageFile?.url}
          big
          onClick={() => {
            uri.addQueryParam('car', car.id);
            uri.setPath('/');
            push(extractRelativePathWithParams(uri));
          }}
        >
          {name}
        </ListItem>
      </li>
    );
  });

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = completeCarList.filter(car => car.variant.match(new RegExp(value, 'i')));
      setFilteredCars(filtered);
    }
  };

  const title = i18n('templates.cars.title')
    .replace('{brand}', model.data.brand.name.toUpperCase())
    .replace('{model}', model.data.name.toUpperCase());

  const description = i18n('templates.cars.description')
    .replace('{brand}', model.data.brand.name)
    .replace('{model}', model.data.name);

  return (
    <FilteredList title={title} filter={search}>
      {carComponents}
    </FilteredList>
  );
};

export async function getStaticPaths() {
  const models = await fetchStrapi<Array<Model>>(`models?${LIMIT_MODELS_PARAMS}`);
  return {
    paths: models?.data.flatMap(model => ([
      { params: { model: `${model.id}` }, locale: 'en' },
      { params: { model: `${model.id}` }, locale: 'fr' },
    ])),
    fallback: false, // can also be true or 'blocking'
  }
}

export async function generateStaticParams({ params }: { params: any }) {
  const model = await fetchStrapi<Model>(`models/${params.model}?populate=*`);
  if (!model) {
    throw new Error(`No model for [model] param ${params.model}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&filters[model][id][$eqi]=${params.model}&${LIMIT_CARS_PER_MODEL_PARAMS}`);
  if (!model) {
    throw new Error(`No car for [model] param ${params.model}`);
  }
  return { model, cars };
}

