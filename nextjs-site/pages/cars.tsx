import React, { useState } from 'react';


import Uri from 'jsuri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilteredList from '../app/components/utils/filtered-list';
import ListItem from '../app/components/utils/list-item';
import { Layout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import { sortCars } from '../functions/sort';
import { extractRelativePathWithParams } from '../functions/url';
import carsStyles from './cars.module.scss';
import { useLocation } from '../app/hooks/useLocation';
import { Car } from '../types/car';
import { useRouter } from 'next/router';

type CarsProps = {
  i18n: any;
  cars: Array<Car>;
};
const Cars = ({ i18n, cars }: CarsProps) => {
  const location = useLocation();
  const uri = new Uri(location);
  const { push } = useRouter();

  const completeCarList = cars.sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList);
  filteredCars.splice(0, filteredCars.length - 20);

  const [selectedCar, setSelectedCar] = useState<number>();

  const validateCar = (index: number, id: number | string) => {
    uri.replaceQueryParam(`car${index}`, id);
    uri.setPath('/');
    push(extractRelativePathWithParams(uri));
  };

  const carComponents = filteredCars.map(car => {
    const isSelected = selectedCar === car.id;
    const imageUrl = `/images/${car.id}-resized.jpg`;
    const radioClassNames = ['radio', carsStyles.radioLabel].join(' ');
    return (
      <li key={`carItem${car.id}`}>
        <ListItem
          id={car.id}
          name={car.variant + (car.startYear ? ` - ${car.startYear}` : '')}
          image={imageUrl}
          big
          selected={false}
          onClick={() => setSelectedCar(car.id)}
        />
        {
          !isSelected
          && (
            <button
              type="button"
              className={`${carsStyles.iconButton} icon-button`}
              onClick={() => setSelectedCar(car.id)}
              title={i18n['pages.cars.add_to_garage_tooltip']}
            >
              <FontAwesomeIcon icon="plus" />
            </button>
          )
        }
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

  const title = i18n['pages.cars.meta.title'];
  return (
    <Layout uri={uri.toString()} title={title}>
      <SEO
        uri={location}
        title={title}
        description={i18n['pages.cars.meta.description']}
      />
      <FilteredList
        title={`${completeCarList.length} ${i18n['pages.cars.list_title']}`}
        filter={search}
      >
        {carComponents}
      </FilteredList>
    </Layout>
  );
};

export default Cars;
