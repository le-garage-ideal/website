import React, { useState } from "react";
import { graphql } from 'gatsby';
import Uri from 'jsuri';
import { schema, carLabels } from '../constants';
import Layout from "../components/layout";
import SEO from "../components/seo/seo";
import carsStyles from "./cars.module.scss";
import FilteredList from '../components/utils/filtered-list';
import ListItem from '../components/utils/list-item';
import sortCars from '../functions/sort';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default (data) => {
    
    const uri = new Uri(window.location);
    
    const completeCarList = data.pageResources.json.data[schema + 'Cars'].edges.map(({ node }) => node).sort(sortCars);
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
        const imageUrl = `/images/${car.mongodb_id}.jpg`;
        return (
            <div key={'carItem' + car.mongodb_id}>
                <ListItem
                    id={car.mongodb_id}
                    name={car.variant + (car.startYear ? ' - ' + car.startYear : '')}
                    image={imageUrl}
                    big={true}
                    selected={false}
                    onClick={() => {
                        uri.setPath(`/car/${car.mongodb_id}`);
                        window.location.href = uri.toString();
                    }}>
                </ListItem>
                { !isSelected && 
                    <button className={carsStyles.iconButton + " icon-button"} onClick={() => setSelectedCar(car.mongodb_id)}
                        title="Ajouter au garage">
                        <FontAwesomeIcon icon="plus" />
                    </button>
                }
                { 
                    isSelected &&
                    <div className={carsStyles.carSelectionBox}>
                        <div className="control">
                            <label className="radio">
                                <input type="radio" name={carLabels[0]} onChange={() => validateCar(1, car.mongodb_id)} />&nbsp;
                                {carLabels[0]}
                            </label>
                            <label className="radio">
                                <input type="radio" name={carLabels[1]} onChange={() => validateCar(2, car.mongodb_id)} />&nbsp;
                                {carLabels[1]}
                            </label>
                            <label className="radio">
                                <input type="radio" name={carLabels[2]} onChange={() => validateCar(3, car.mongodb_id)} />&nbsp;
                                {carLabels[2]}
                            </label>
                        </div>
                    </div>
                }   
            </div>
        )
    });

    const search = value => {
        const regex = new RegExp(value, 'i');
        const filtered = completeCarList.filter(car => car.variant.match(regex) || car.model.brand.name.match(regex));
        setFilteredCars(filtered);
    };

    return (
        <Layout>
            <SEO title="Toutes les voitures sportives" description="Liste de toutes les voitures sportives disponibles" />
            <FilteredList title={completeCarList.length + ' voitures de sport disponibles!'} render={() => carComponents} filter={search} />
        </Layout>
    );
};

export const query = graphql`
    query {
        allMongodbBmbu7Ynqra11RqiCars {
        edges {
          node {
              mongodb_id,
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
