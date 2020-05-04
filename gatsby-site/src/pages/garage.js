import React from "react";
import Uri from 'jsuri';
import Layout from "../components/layout";
import './bulma-theme.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import garageStyles from './garage.module.scss';

export default ({ location }) => {

    const uri = new Uri(location.href);

    const editCar = index => {
        console.log('editCar');
        uri.setPath('/browse');
        uri.addQueryParam('edit', index);
        window.location.href = uri.toString();
    };

    const transform = (carUrl, index) => {
        const classCar = [garageStyles.car];
        if (index == 2) {
            classCar.push(garageStyles.car2);
        }
        return (
            <div className={classCar.join(' ')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <button className={garageStyles.searchIcon + ' icon'}
                    onClick={() => editCar(index)}>
                    <FontAwesomeIcon icon="edit" />
                </button>
                <iframe className={ garageStyles.iframe } src={carUrl} style={{  }}>
                </iframe>
            </div>
        );

    };

    const car1 = transform(`/car/${uri.getQueryParamValue('car1')}`, 1);
    const car2 = transform(`/car/${uri.getQueryParamValue('car2')}`, 2);
    const car3 = transform(`/car/${uri.getQueryParamValue('car3')}`, 3);

    return (
        <Layout>
            <h1 className="title is-2">Mon Garage Idéal</h1>
            <article className="car-content">
                {car1} {car2} {car3}
            </article>
        </Layout>
    );
};


