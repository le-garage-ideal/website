import React from "react";
import carStyles from './car.module.scss';
import { EmptyLayout } from '../components/layout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ pageContext }) => {

    const car = pageContext.car;

    const years = `(${car.startYear}${car.endYear ? ' - ' + car.endYear : ''})`;

    return (
        <EmptyLayout>
            <article className={carStyles.card}>

                <div href={car.imageUrl} className={carStyles.imageLink}
                    style={{ backgroundImage: `url(${car.imageUrl})`, backgroundSize: 'cover' }}>
                </div>

                <div className={carStyles.carSummary + ' dropdown is-hoverable'}>
                    <h3 className="dropdown-trigger" aria-controls={'dropdown-' + car.id}>
                        <span>{car.brand}</span>&nbsp;
              <span className={carStyles.name}>{car.variant}</span>&nbsp;
              <span className={carStyles.startYear}>{years}</span>
                    </h3>
                </div>

            </article >
        </EmptyLayout>
    );
};
