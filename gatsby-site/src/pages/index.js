import Uri from 'jsuri';
import React from 'react';
import { graphql } from 'gatsby'
import Layout from "../components/layout";
import SEO from "../components/seo/seo";
import { Title } from "../components/title/title";
import './bulma-theme.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import indexStyles from './index.module.scss';
import { carLabels, schema } from "../constants";
import { GarageProvider } from '../context/garage.context';
import { eachCar, eachCarIndex } from '../functions/cars';
import { Car } from '../components/car/car';

const carComponentId = index => `car-${index}`;
const editButtonId = index => `edit-${index}`;

export default class Garage extends React.Component {

    constructor(props) {
        super(props);

        const uri = new Uri(props.location.href);

        // if edit=X parameter, save car to carX parameter
        const editParam = uri.getQueryParamValue('edit');
        const carParam = uri.getQueryParamValue('car');
        if (editParam && carParam) {
            uri.replaceQueryParam(`car${editParam}`, carParam);
            this.setState({saveOk: false});
        }
        uri.deleteQueryParam('edit');
        uri.deleteQueryParam('car');

        // add missing params + save state
        const newState = {...this.state};
        eachCar(param => {
            if (!uri.getQueryParamValue(param)) {
                uri.addQueryParam(param, localStorage.getItem(param));
            }
            const foundNode = newState[param] = props.data[schema + 'Cars'].edges
                .find(({ node: car }) => car.mongodb_id === uri.getQueryParamValue(param));
            newState[param] = foundNode.node;
        });
        newState.uri = uri.toString();

        // Save button enabled?
        newState.saveOk = eachCar(param => newState[param] === localStorage.getItem(param)).every(val => !!val);

        this.state = newState;

        if (document) {
            setTimeout(() => {
                eachCarIndex(editButtonIdx => document.querySelector(`#${editButtonId(editButtonIdx + 1)}`).style.opacity = '1')
            }, 500);
        }
    }

    render() {

        const editCar = index => {
            const uri = new Uri(this.state.uri);
            uri.setPath('/browse');
            uri.addQueryParam('edit', index);
            window.location.href = uri.toString();
        };

        const transform = (car, index) => {

            const classCar = [indexStyles.car];
            if (index === 2) {
                classCar.push(indexStyles.car2);
            }
            if (car) {
                classCar.push(indexStyles.withCar);
            } else {
                classCar.push(indexStyles.noCar);
            }
            const title = carLabels[index-1];
            const thumbnail = car ? (
                <Car id={carComponentId(index)} title={title} className={indexStyles.carComponent} car={car}
                    initial={{opacity: 0}} animate={{ opacity: 1 }}>
                </Car>
            ) : (
                <div className={indexStyles.noCarThumbnail}>?</div>
            );
            return (
                <div className={classCar.join(' ')}>
                    <div id={editButtonId(index)} className={indexStyles.iconButtonContainer}>
                        <button className={indexStyles.iconButton + " icon-button"} onClick={() => editCar(index)}>
                            <FontAwesomeIcon icon="edit" />
                        </button>
                    </div>                    
                    {thumbnail}
                    <div className={[indexStyles.carLabelContainer, 'container', 'is-full'].join(' ')}>
                        <span className={[indexStyles.carLabel, 'badge'].join(' ')}>{ title }</span>
                    </div>                    
                </div>
            );

        };

        const car1 = transform(this.state.car1, 1);
        const car2 = transform(this.state.car2, 2);
        const car3 = transform(this.state.car3, 3);

        const save = () => {
            for (let saveIndex = 1; saveIndex <= 3; saveIndex++) {
                const saveParam = `car${saveIndex}`;
                localStorage.setItem(saveParam, this.state[saveParam]);
                this.setState({saveOk: true, showSaveMessage: true});
                setTimeout(() => this.setState({showSaveMessage: false}), 1000)
            }
        }

        return (
            <GarageProvider value={{uri: this.state.uri, car1: this.state.car1, car2: this.state.car2, car3: this.state.car3}}>
                <Layout location={this.state.uri} save={save} saveDisabled={this.state.saveOk} showSaveMessage={this.state.showSaveMessage}>
                    <SEO location={this.props.location.pathname} title="" description="Créez et partagez votre garage idéal en 3 voitures de sport" />
                    <Title />
                    <article className={indexStyles.carsContainer}>
                        {car1} {car2} {car3}
                    </article>
                </Layout>
            </GarageProvider>
        );
    }
}

export const query = graphql`query {
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
          favcarsVariants { name, urls },
          selectedFavcarsUrl,
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

