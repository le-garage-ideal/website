import React from "react";
import Uri from 'jsuri';
import { graphql } from 'gatsby';
import Layout from "../components/layout";
import './bulma-theme.scss';
import { schema } from '../constants';
import { SelectedCar } from '../components/car/selected-car';

export default ({data, location}) => {

    const uri = new Uri(location.href);

    const editCar = index => {
        uri.setPath('/browse');
        uri.addQueryParam('edit', index);
        window.location.href = uri.toString();
    };

    const transform = (car, index) =>
        <div className={'car car' + index}><SelectedCar key={car.id}
            id={car.id}
            variant={car.variant}
            power={car.power}
            weight={car.weight}
            startYear={car.startYear}
            endYear={car.endYear}
            brand={car.model.brand.name}
            model={car.model.name}
            imageUrl={car.imageUrl}
            onClick={() => editCar(index)}
        /></div>;

    const cars = data[schema + 'Cars'].edges.map(car => car.node);

    const car1 = transform(cars.filter(car => car.id === car1Param), 1);
    const car2 = transform(cars[60].node, 2);
    const car3 = transform(cars[90].node, 3);

    return (
        <Layout>
            <h1 className="title is-2">Mon Garage Idéal</h1>
            <article className="car-content">
                {car1} {car2} {car3}
            </article>
        </Layout>
    );
};

export const query = graphql`
    query CarsByIds($car1: String, $car2: String, $car3: String) {
        allMongodbBmbu7Ynqra11RqiCars(filter: {id: {in: [$car1, $car2, $car3]}}) {
        edges {
          node {
              variant,
              power,
              officialWeight, 
              weight,
              options,
              startYear,
              endYear,
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
