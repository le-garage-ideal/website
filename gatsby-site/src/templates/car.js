import React, { useState } from "react";
import carStyles from './car.module.scss';
import { EmptyLayout } from '../components/layout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ pageContext }) => {

    const car = pageContext.car;

    const years = `(${car.startYear}${car.endYear ? ' - ' + car.endYear : ''})`;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imageUrl = `/images/${car.mongodb_id}.jpg`;

    // const clickLeft = () => {
    //     if (currentImageIndex > 0) {
    //         setCurrentImageIndex(currentImageIndex - 1);
    //     }
    // }

    // const clickRight = () => {
    //     if (urls && currentImageIndex < urls.length - 1) {
    //         setCurrentImageIndex(currentImageIndex + 1);
    //     }
    // }

    return (
        <EmptyLayout>
            <article className={carStyles.card}>

                <div href={car.imageUrl} className={carStyles.imageLink}
                    style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPositionY: 'center' }}>
                        {/* <button><FontAwesomeIcon icon="chevron-circle-left" size="2x" onClick={ clickLeft } /></button>
                        <button><FontAwesomeIcon icon="chevron-circle-right" size="2x" onClick={ clickRight } /></button> */}
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
