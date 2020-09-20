import React from "react";
import { EmptyLayout } from '../components/layout';
import { SEO } from "../components/seo/seo";
import { Car } from '../components/car/car';

export default ({ pageContext, location }) => {

    const car = pageContext.car;

    const carFullname = `${car.model.brand.name} ${car.variant}`;

    return (
        <EmptyLayout>
            <SEO location={location.pathname} title={carFullname} description={`Photo et détail de la voiture : ${carFullname}`} />
            <Car car={car} />
        </EmptyLayout>
    );
};
