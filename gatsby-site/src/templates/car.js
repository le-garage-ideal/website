import React from "react";
import carStyles from './car.module.scss';
import { EmptyLayout } from '../components/layout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ pageContext }) => {

    const car = pageContext.car;

    const years = `(${car.startYear}${car.endYear ? ' - ' + car.endYear : ''})`;

    const imageUrl = car.favcarsVariants && car.favcarsVariants.length > 0 && car.favcarsVariants[0].urls && car.favcarsVariants[0].urls.length > 0 ?
        car.favcarsVariants[0].urls[0] : '/';

    return (
        <EmptyLayout>
            <article className={carStyles.card}>

                <div href={car.imageUrl} className={carStyles.imageLink}
                    style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}>
                </div>

                <div className={carStyles.carSummary + ' dropdown is-hoverable'}>
                    <h3 className="dropdown-trigger" aria-controls={'dropdown-' + car.id}>
                        <span>{car.model.brand.name}</span>&nbsp;
              <span className={carStyles.name}>{car.variant}</span>&nbsp;
              <span className={carStyles.startYear}>{years}</span>
                    </h3>
                </div>

            </article >
        </EmptyLayout>
    );
};
