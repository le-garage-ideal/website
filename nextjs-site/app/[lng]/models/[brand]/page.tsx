"use client";

import React, { useState } from 'react';
import Uri from 'jsuri';
import { useRouter } from 'next/router';

import { sortModels } from '../../../../functions/sort';
import FilteredList from '../../../components/filtered-list/filtered-list';
import ListItem from '../../../components/filtered-list/list-item';
import { extractRelativePathWithParams } from '../../../../functions/url';
import { Car } from '../../../../types/car';
import { useLocation } from '../../../hooks/useLocation';
import {
  fetchStrapi,
  LIMIT_BRANDS_PARAMS,
  LIMIT_MODELS_PER_BRAND_PARAMS,
  POPULATE_CARS_PARAMS,
  StrapiResponseType,
} from '../../../../functions/api';
import { Brand } from '../../../../types/brand';
import { Model } from '../../../../types/model';
import { I18nParamsType } from '../../../../types/i18n';
import { useTranslation } from '../../../i18n';

type ModelsProps = I18nParamsType & {
  brand: StrapiResponseType<Brand>;
  cars: StrapiResponseType<Array<Car>>;
};
const Models = async ({ brand, cars, params: { lng } }: ModelsProps) => {
  const { t: i18n } = await useTranslation(lng, 'common');
  const { push } = useRouter();
  const {location} = useLocation();

  const uri = new Uri(location);
  const listName: Array<Car> = cars
    .data
    .sort((a, b) => sortModels(a.model, b.model))
    .reduce((acc, el) => (
      acc[acc.length - 1] && acc[acc.length - 1].model.name === el.model.name ?
        acc
        :
        [...acc, el]
    ), new Array<Car>());
  const [filteredModels, setFilteredModels] = useState(listName);

  const modelComponents = filteredModels.map(car => (
    <li key={car.model.name}>
      <ListItem
        id={car.model.name}
        name={car.model.name}
        image={car.imageFile?.formats?.thumbnail?.url ?? car.imageFile?.url}
        big
        onClick={() => {
          uri.setPath(`/cars/${car.model.id}`);
          push(extractRelativePathWithParams(uri));
        }}
      >
        {car.model.name}
      </ListItem>
    </li>
  ));

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = listName.filter(car => car.model.name.match(new RegExp(value, 'i')));
      setFilteredModels(filtered);
    }
  };

  const title = i18n('templates.models.title')
    .replace('{brand}', brand.data.name);

  const description = i18n('templates.models.description')
    .replace('{brand}', brand.data.name);

  return (
    <FilteredList title={title} filter={search}>
      {modelComponents}
    </FilteredList>
  );
};

export async function getStaticPaths() {
  const brands = await fetchStrapi<Array<Model>>(`brands?${LIMIT_BRANDS_PARAMS}`);
  return {
    paths: brands?.data.flatMap(brand => ([
      { params: { brand: `${brand.id}` }, locale: 'en' },
      { params: { brand: `${brand.id}` }, locale: 'fr' },
    ])),
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps({ locale, params }: { locale: string, params: any }) {
  const brand = await fetchStrapi<Brand>(`brands/${params.brand}?populate=*`);
  if (!brand) {
    throw new Error(`No brand for [brand] param ${params.brand}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&filters[model][brand][id][$eq]=${brand.data.id}&${LIMIT_MODELS_PER_BRAND_PARAMS}`);
  if (!cars?.data.length) {
    throw new Error(`No cars for [brand] param ${params.brand}`);
  }
  return {
    props: {
      brand,
      cars,
    },
  }
}

export default Models;
