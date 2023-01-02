import React, { useState } from 'react';


import Uri from 'jsuri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl, navigate } from 'gatsby-plugin-react-intl';
import FilteredList from '../components/utils/filtered-list';
import ListItem from '../components/utils/list-item';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import { sortCars } from '../functions/sort';
import { extractRelativePathWithParams } from '../functions/url';
import carsStyles from './cars.module.scss';

const Cars = ({ data, location }) => {
  const i18n = useContext(I18nContext);

  const uri = new Uri(location.href);

  const completeCarList = data.allMongodbBmbu7Ynqra11RqiCars.edges.map(({ node }) => node).sort(sortCars);
  const [filteredCars, setFilteredCars] = useState([...completeCarList]);
  filteredCars.splice(0, filteredCars.length - 20);

  const [selectedCar, setSelectedCar] = useState(null);

  const validateCar = (index, id) => {
    uri.replaceQueryParam(`car${index}`, id);
    uri.setPath('/');
    navigate(extractRelativePathWithParams(uri));
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

  const search = value => {
    const regex = new RegExp(value, 'i');
    const filtered = completeCarList.filter(car => car.variant.match(regex) || car.model.brand.name.match(regex));
    setFilteredCars(filtered);
  };

  return (
    <Layout uri={uri.toString()}>
      <SEO
        uri={location.href}
        location={location.pathname}
        title={i18n['pages.cars.meta.title']}
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

Cars.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiCars: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: string;
            variant: string;
            startYear?: string;
            model: PropTypes.shape({
              brand: PropTypes.shape({
                name: string;
              }),
              name: string;
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    href: string;
    pathname: string;
  }).isRequired,
};

export default Cars;

export const query = graphql`
    query {
        allMongodbBmbu7Ynqra11RqiCars {
        edges {
          node {
              id,
              variant,
              startYear,
              model {
                  brand {
                      name
                  }
                 name
              }
          }
        }
      }
    }`;
