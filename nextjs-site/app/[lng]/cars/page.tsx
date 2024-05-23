"use client";

import React, { useState } from 'react';
import Uri from 'jsuri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

import FilteredList from '../../components/filtered-list/filtered-list';
import ListItem from '../../components/filtered-list/list-item';
import { sortCars } from '../../../functions/sort';
import { extractRelativePathWithParams } from '../../../functions/url';
import carsStyles from './cars.module.scss';
import { useLocation } from '../../hooks/useLocation';
import { Car } from '../../../types/car';
import { fetchStrapi, LIMIT_CARS_PARAMS, POPULATE_CARS_PARAMS, StrapiResponseType } from '../../../functions/api';
import { useTranslation } from '../../i18n';

type CarsProps = {
  params: {
    cars: StrapiResponseType<Array<Car>>;
    lng: string;
  }
};
export default async function Cars({ params: { cars, lng } }: CarsProps) {
  const {location} = useLocation();
  const { t: i18n } = await useTranslation(lng, 'common');
  const uri = new Uri(location);
  const { push } = useRouter();

  const completeCarList = cars.data.sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList.slice(0, 20));

  const [selectedCar, setSelectedCar] = useState<number>();

  const validateCar = (index: number, id: number | string) => {
    uri.replaceQueryParam(`car${index}`, id);
    uri.setPath('/');
    push(extractRelativePathWithParams(uri));
  };

  const carComponents = filteredCars.map(car => {
    const isSelected = selectedCar === car.id;
    const radioClassNames = ['radio', carsStyles.radioLabel].join(' ');
    const name = `${car.model.brand.name} ${car.variant} ${(car.startYear ? ' - ' + car.startYear : '')}`;
    return (
      <li key={`carItem${car.id}`}>
        <ListItem
          id={car.id}
          name={name}
          image={car.imageFile?.formats?.thumbnail?.url ?? car.imageFile?.url}
          big
          selected={false}
          onClick={() => setSelectedCar(car.id)}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              { !isSelected && (
                <button
                  type="button"
                  className={`${carsStyles.iconButton} icon-button`}
                  onClick={() => setSelectedCar(car.id)}
                  title={i18n('pages.cars.add_to_garage_tooltip')}
                >
                  <FontAwesomeIcon icon="plus" />
                </button>
              )}
            <div style={{ marginLeft: '4px', marginTop: '6px'}}>{name}</div>
          </div>
          {
            isSelected
            && (
              <div className={carsStyles.carSelectionBox}>
                <div className="control">
                  <label className={radioClassNames}>
                    <input type="radio" name="#1" onChange={() => validateCar(1, car.id)} />
                    &nbsp;
                    #1
                  </label>
                  <label className={radioClassNames}>
                    <input type="radio" name="#2" onChange={() => validateCar(2, car.id)} />
                    &nbsp;
                    #2
                  </label>
                  <label className={radioClassNames}>
                    <input type="radio" name="#3" onChange={() => validateCar(3, car.id)} />
                    &nbsp;
                    #3
                  </label>
                </div>
              </div>
            )
          }
        </ListItem>
      </li>
    );
  });

  const search = (value: string | undefined) => {
    if (value) {
      const regex = new RegExp(value, 'i');
      const filtered = completeCarList.filter(car => car.variant.match(regex) || car.model.brand.name.match(regex));
      setFilteredCars(filtered);
    }
  };

  const title = i18n('pages.cars.meta.title');
  return (
    <FilteredList
      title={`${cars.meta.pagination.total} ${i18n('pages.cars.list_title')}`}
      filter={search}
    >
      {carComponents}
    </FilteredList>
  );
}

export async function generateStaticParams({ locale }: { locale: string }) {
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&${LIMIT_CARS_PARAMS}`);
  return cars;
}

