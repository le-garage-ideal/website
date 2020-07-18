import React from "react";
import Uri from 'jsuri';
import Layout from "../components/layout";
import './bulma-theme.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import garageStyles from './garage.module.scss';
import { carLabels } from "../constants";

export default class Garage extends React.Component {

    constructor(props) {
        super(props);
        this.iframeRefs = [React.createRef(), React.createRef(), React.createRef()];
    }

    componentDidMount() {
    }

    render() {
        const uri = new Uri(this.props.location.href);

        const editCar = index => {
            uri.setPath('/browse');
            uri.addQueryParam('edit', index);
            window.location.href = uri.toString();
        };

        const transform = (carUrl, index) => {
            const classCar = [garageStyles.car];
            if (index === 2) {
                classCar.push(garageStyles.car2);
            }
            if (carUrl) {
                classCar.push(garageStyles.withCar);
            } else {
                classCar.push(garageStyles.noCar);
            }
            const id = `frame-${index}`;
            const title = carLabels[index-1];
            const thumbnail = carUrl ? (
                <>
                    <div className={garageStyles.iconButtonContainer}>
                        <button className={garageStyles.iconButton + " icon-button"} onClick={() => editCar(index)}>
                            <FontAwesomeIcon icon="edit" />
                        </button>
                    </div>
                    <iframe id={id} title={title} ref={this.iframeRefs[index - 1]} className={garageStyles.iframe} src={`/car/${carUrl}`}>
                    </iframe>
                    <div className={[garageStyles.carLabelContainer, 'container', 'is-full'].join(' ')}>
                        <span className={[garageStyles.carLabel, 'badge'].join(' ')}>{ title }</span>
                    </div>
                </>
            ) : (<span className={'badge '+ garageStyles.carLabel}>
                    {title} &nbsp;
                    <button className={garageStyles.iconButton + " icon-button"} onClick={() => editCar(index)}>
                        <FontAwesomeIcon icon="edit" />
                    </button>
                </span>);
            return (
                <div className={classCar.join(' ')}>
                    {thumbnail}
                </div>
            );

        };

        const car1 = transform(uri.getQueryParamValue('car1'), 1);
        const car2 = transform(uri.getQueryParamValue('car2'), 2);
        const car3 = transform(uri.getQueryParamValue('car3'), 3);

        return (
            <Layout>
                <div className={[garageStyles.titleContainer, 'badge'].join(' ')}>
                    <h1 className={[garageStyles.title, 'chrome-text'].join(' ')}><span>Le Garage Idéal</span></h1>
                    <h4 className={garageStyles.subTitle}>Créez et partagez votre garage idéal</h4>
                </div>
                <article className={garageStyles.carsContainer}>
                    {car1} {car2} {car3}
                </article>
            </Layout>
        );
    }
}


