import React from "react";
import { graphql } from 'gatsby';
import Layout from "../components/layout";
import './bulma-theme.scss';
import { schema } from '../constants';
import { SelectedCar } from '../components/car/selected-car';

export default (data) => {

    const cars = data.pageResources.json.data[schema + 'Cars'].edges;
    const car1 = cars[3].node;
    console.log(car1);
    const car2 = cars[6];
    const car3 = cars[9];
    return (
        <Layout>
            <SelectedCar key={car1.id}
                id={car1.id}
                variant={car1.variant}
                power={car1.power}
                weight={car1.weight}
                startYear={car1.startYear}
                endYear={car1.endYear}
                brand={car1.model.brand.name}
                model={car1.model.name}
                imageUrl={car1.imageUrl}>
            </SelectedCar>
        </Layout>
    );
};

export const query = graphql`query {
    allMongodbBmbu7Ynqra11RqiCars(limit: 10) {
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
                    },
                    name
                }
            }
        }
    }
}`;
