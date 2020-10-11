import Uri from 'jsuri';
import React from 'react';
import { graphql } from 'gatsby';
import './bulma-theme.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { carLabels, schema } from '../constants';
import { eachCar, eachCarIndex, fullname } from '../functions/cars';
import indexStyles from './index.module.scss';
import { Title } from '../components/title/title';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
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
      this.setState({ saveOk: false });
    }
    uri.deleteQueryParam('edit');
    uri.deleteQueryParam('car');

    // add missing params + save state
    const newState = { ...this.state };
    const windowGlobal = typeof window !== 'undefined' && window;
    if (windowGlobal) {
      eachCar(param => {
        // Priority to URL if user copy paste shared garage
        const carId = uri.getQueryParamValue(param) || localStorage.getItem(param);

        if (carId) {
          const foundNode = props.data[`${schema}Cars`].edges
            .find(({ node: car }) => car.mongodb_id === carId);

          if (foundNode) {
            if (!uri.getQueryParamValue(param)) {
              // If carId comes from localstorage and was not on URL, add it
              uri.addQueryParam(param, foundNode.node);
            }
            newState[param] = foundNode.node;
          } else if (!uri.getQueryParamValue(param)) {
            // If carId comes from localstorage and was not found, remove it
            localStorage.removeItem(param);
          }
        }
      });
    }
    newState.uri = uri.toString();

    // Save button enabled?
    if (windowGlobal) {
      newState.saveOk = eachCar(param => newState[param] === localStorage.getItem(param)).every(val => !!val);
    }

    this.state = newState;

    if (windowGlobal) {
      setTimeout(() => {
        eachCarIndex(editButtonIdx => {
          document.querySelector(`#${editButtonId(editButtonIdx + 1)}`).style.opacity = '1';
        });
      }, 200);
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
      const title = carLabels[index - 1];
      const thumbnail = car ? (
        <Car
          id={carComponentId(index)}
          title={title}
          className={indexStyles.carComponent}
          car={car}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      ) : (
          <div className={indexStyles.noCarThumbnail}>?</div>
        );
      return (
        <div className={classCar.join(' ')}>
          <div id={editButtonId(index)} className={indexStyles.iconButtonContainer}>
            <button type="button" className={`${indexStyles.iconButton} icon-button`} onClick={() => editCar(index)}>
              <FontAwesomeIcon icon="edit" />
            </button>
          </div>
          {thumbnail}
          <div className={[indexStyles.carLabelContainer, 'container', 'is-full'].join(' ')}>
            <span className={[indexStyles.carLabel, 'badge'].join(' ')}>{title}</span>
          </div>
        </div>
      );
    };

    const car1 = transform(this.state.car1, 1);
    const car2 = transform(this.state.car2, 2);
    const car3 = transform(this.state.car3, 3);

    const save = () => {
      for (let saveIndex = 1; saveIndex <= 3; saveIndex += 1) {
        const saveParam = `car${saveIndex}`;
        localStorage.setItem(saveParam, this.state[saveParam]);
        this.setState({ saveOk: true, showSaveMessage: true });
        setTimeout(() => this.setState({ showSaveMessage: false }), 2000); // message will be displayed during 2s
      }
    };

    const title = eachCar(car => (this.state[car] ? fullname(this.state[car]) : null)).filter(s => !!s).join('\n');
    return (
      <Layout
        location={this.state.uri}
        save={save}
        title={title}
        uri={this.state.uri}
        saveDisabled={this.state.saveOk}
        showSaveMessage={this.state.showSaveMessage}
      >
        <SEO
          location={this.props.location.pathname}
          title={title}
          uri={this.state.uri}
          description="Créez et partagez votre garage idéal en 3 voitures de sport"
        />
        <Title />
        <article className={indexStyles.carsContainer}>
          {car1}
          {' '}
          {car2}
          {' '}
          {car3}
        </article>
      </Layout>
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
