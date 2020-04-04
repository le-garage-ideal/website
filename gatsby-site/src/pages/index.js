import React from "react";
import { graphql } from 'gatsby';
import Layout from "../components/layout";
import './bulma-theme.scss';
import { schema } from '../constants';
import { SelectedCar } from '../components/car/selected-car';

export default (data) => {

    const transform = (car, className) =>
        <div className={className}><SelectedCar key={car.id}
            id={car.id}
            variant={car.variant}
            power={car.power}
            weight={car.weight}
            startYear={car.startYear}
            endYear={car.endYear}
            brand={car.model.brand.name}
            model={car.model.name}
            imageUrl={car.imageUrl}
        /></div>;

    const cars = data.pageResources.json.data[schema + 'Cars'].edges;
    const car1 = transform(cars[3].node, 'car car1');
    const car2 = transform(cars[60].node, 'car car2');
    const car3 = transform(cars[90].node, 'car car3');

    return (
        <Layout>
            <h1 className="title is-2">Mon Garage Idéal</h1>
            <article className="car-content">
                {car1} {car2} {car3}
            </article>
        </Layout>
    );
};

export const query = graphql`query {
    allMongodbBmbu7Ynqra11RqiCars(limit: 100) {
        edges {
            node {
                variant,
                power,
                officialWeight, 
                weight,
                options,
                startYear,
                endYear,
                imageUrl,
                model {
                    brand {
                        name
                    },
                    name
                }
            }
        }
    }
}`;
