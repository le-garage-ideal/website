import React, { useState } from 'react';
import { useTranslation} from 'next-export-i18n';
import Uri from 'jsuri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilteredList from '../app/components/utils/filtered-list';
import ListItem from '../app/components/utils/list-item';
import { FullLayout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import { sortCars } from '../functions/sort';
import { extractRelativePathWithParams } from '../functions/url';
import carsStyles from './cars.module.scss';
import { useLocation } from '../app/hooks/useLocation';
import { Car } from '../types/car';
import { useRouter } from 'next/router';
import { fetchStrapi } from '../functions/api';

type CarsProps = {
  cars: Array<Car>;
};
const Cars = ({ cars }: CarsProps) => {
  const location = useLocation();
  const uri = new Uri(location);
  const { push } = useRouter();
  const { t: i18n } = useTranslation();

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
    const radioClassNames = ['radio', carsStyles.radioLabel].join(' ');
    return (
      <li key={`carItem${car.id}`}>
        <ListItem
          id={car.id}
          name={car.variant + (car.startYear ? ` - ${car.startYear}` : '')}
          image={car.imageFile?.url}
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
              title={i18n('pages.cars.add_to_garage_tooltip')}
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

  const title = i18n('pages.cars.meta.title');
  return (
    <FullLayout uri={uri.toString()} title={title}>
      <SEO
        uri={location}
        title={title}
        description={i18n('pages.cars.meta.description')}
      />
      <FilteredList
        title={`${completeCarList.length} ${i18n('pages.cars.list_title')}`}
        filter={search}
      >
        {carComponents}
      </FilteredList>
    </FullLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  const cars = await fetchStrapi<Array<Car>>(`cars?populate[model][populate][0]=brand&populate[0]=imageFile`);
  return {
    props: {
      cars,
    },
  }
}

export default Cars;
