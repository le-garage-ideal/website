import React from 'react';
import { EmptyLayout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import { Car } from '../components/car/car';
import { fullname } from '../functions/cars';

export default ({ pageContext, location }) => {
  const { car } = pageContext;

  const carFullname = fullname(car);

  return (
    <EmptyLayout>
      <SEO
        location={location.pathname}
        title={carFullname}
        description={`Photo et détail de la voiture : ${carFullname}`}
      />
      <Car car={car} />
    </EmptyLayout>
  );
};
