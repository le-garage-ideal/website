import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Uri from 'jsuri';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { carLabels } from '../constants';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import carsStyles from './cars.module.scss';
import FilteredList from '../components/utils/filtered-list';
import ListItem from '../components/utils/list-item';
import { sortCars } from '../functions/sort';

const Cars = ({ data, location }) => {
  const uri = new Uri(location.href);

  const completeCarList = data.allMongodbBmbu7Ynqra11RqiCars.edges.map(({ node }) => node).sort(sortCars);
  const [filteredCars, setFilteredCars] = useState([...completeCarList]);
  filteredCars.splice(0, filteredCars.length - 20);

  const [selectedCar, setSelectedCar] = useState(null);

  const validateCar = (index, id) => {
    uri.replaceQueryParam(`car${index}`, id);
    uri.setPath('/');
    window.location.href = uri.toString();
  };

  const carComponents = filteredCars.map(car => {
    const isSelected = selectedCar === car.mongodb_id;
    const imageUrl = `/images/${car.mongodb_id}-resized.jpg`;
    return (
      <div key={`carItem${car.mongodb_id}`}>
        <ListItem
          id={car.mongodb_id}
          name={car.variant + (car.startYear ? ` - ${car.startYear}` : '')}
          image={imageUrl}
          big
          selected={false}
          onClick={() => setSelectedCar(car.mongodb_id)}
        />
        {
          !isSelected
          && (
            <button
              type="button"
              className={`${carsStyles.iconButton} icon-button`}
              onClick={() => setSelectedCar(car.mongodb_id)}
              title="Ajouter au garage"
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
                <label className="radio">
                  <input type="radio" name={carLabels[0]} onChange={() => validateCar(1, car.mongodb_id)} />
                  &nbsp;
                  {carLabels[0]}
                </label>
                <label className="radio">
                  <input type="radio" name={carLabels[1]} onChange={() => validateCar(2, car.mongodb_id)} />
                  &nbsp;
                  {carLabels[1]}
                </label>
                <label className="radio">
                  <input type="radio" name={carLabels[2]} onChange={() => validateCar(3, car.mongodb_id)} />
                  &nbsp;
                  {carLabels[2]}
                </label>
              </div>
            </div>
          )
        }
      </div>
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
        location={location.pathname}
        title="Toutes les voitures sportives"
        description="Liste de toutes les voitures sportives disponibles"
      />
      <FilteredList
        title={`${completeCarList.length} voitures de sport disponibles!`}
        render={() => carComponents}
        filter={search}
      />
    </Layout>
  );
};

Cars.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiCars: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            mongodb_id: PropTypes.string.isRequired,
            variant: PropTypes.string.isRequired,
            startYear: PropTypes.string,
            model: PropTypes.shape({
              brand: PropTypes.shape({
                name: PropTypes.string.isRequired,
              }),
              name: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    href: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cars;

export const query = graphql`
    query {
        allMongodbBmbu7Ynqra11RqiCars {
        edges {
          node {
              mongodb_id,
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
