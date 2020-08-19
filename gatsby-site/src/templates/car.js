import React, { useState } from "react";
import Spec from '../components/car/spec';
import carStyles from './car.module.scss';
import { EmptyLayout } from '../components/layout';
import SEO from "../components/seo/seo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ pageContext, location }) => {

    const car = pageContext.car;

    const carFullname = `${car.model.brand.name} ${car.variant}`;

    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const imageUrl = `/images/${car.mongodb_id}.jpg`;

    const clickLeft = () => {
        setCurrentPageIndex(currentPageIndex - 1);
    }

    const clickRight = () => {
        setCurrentPageIndex(currentPageIndex + 1);
    }

    let divContent = null;
    if (currentPageIndex === 0) {
        divContent = <img src={imageUrl} className={carStyles.image} alt={carFullname} />
    } else {
        divContent = 
            <Spec brand={car.model.brand.name} 
                variant={car.variant} 
                power={car.power} 
                weight={car.weight}
                officialWeight={car.officialWeight} 
                startYear={car.startYear} 
                imageUrl={car.selectedFavcarsUrl} />;
    }

    return (
        <EmptyLayout>
            <SEO location={location.pathname} title={carFullname} description={`Photo et détail de la voiture : ${carFullname}`} />
            <article className={carStyles.card}>

                <div href={car.imageUrl} className={carStyles.imageContainer}>
                        { divContent }
                </div>

                <div className={carStyles.carCaption }>
                    <div className={carStyles.switchButtons}>
                        {
                            currentPageIndex === 1 && 
                            <button className={['icon-button', 'icon', carStyles.iconButton].join(' ')}>
                                <FontAwesomeIcon icon="image" size="2x" onClick={ clickLeft } />
                            </button> 
                        }
                        {
                            currentPageIndex === 0 && 
                            <button className={['icon-button', 'icon', carStyles.iconButton].join(' ')}>
                                <FontAwesomeIcon icon="th-list" size="2x" onClick={ clickRight } />
                            </button>
                        }
                    </div>
                    <div className={carStyles.carTitle}>
                        <h3 className={carStyles.carLongLabel} title={carFullname}>{carFullname}</h3>
                    </div>
                    <div className={carStyles.carYear}>{car.startYear}</div>
                </div>

            </article >
        </EmptyLayout>
    );
};
