import Uri from 'jsuri';
import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'gatsby';
import './bulma-theme.scss';
import { eachCar, eachCarIndex, fullname } from '../functions/cars';
import { save } from '../functions/storage';
import indexStyles from './index.module.scss';
import { carLabels } from '../constants';
import { Card } from '../components/utils/card';
import { Title } from '../components/title/title';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import { Car } from '../components/car/car';

const carComponentId = index => `car-${index}`;
const editButtonId = index => `edit-${index}`;

class Garage extends React.Component {
  constructor(props) {
    super(props);

    const uri = new Uri(props.location.href);

    // if edit=X parameter, save car to carX parameter
    const editParam = uri.getQueryParamValue('edit');
    const carParam = uri.getQueryParamValue('car');
    const initState = {
      saveMessage: null,
    };
    if (editParam && carParam) {
      uri.replaceQueryParam(`car${editParam}`, carParam);
      initState.saveOk = false;
    }
    uri.deleteQueryParam('edit');
    uri.deleteQueryParam('car');

    // add missing params + save state
    const windowGlobal = typeof window !== 'undefined' && window;
    initState.cars = [];
    if (windowGlobal) {
      eachCar((param, idx) => {
        initState.cars[idx] = null;

        // Priority to URL if user copy paste shared garage
        const carId = uri.getQueryParamValue(param) || localStorage.getItem(param);

        if (carId) {
          const foundNode = props.data.allMongodbBmbu7Ynqra11RqiCars.edges
            .find(({ node: car }) => car.mongodb_id === carId);

          if (foundNode) {
            if (!uri.getQueryParamValue(param)) {
              // If carId comes from localstorage and was not on URL, add it
              uri.addQueryParam(param, foundNode.node);
            }
            initState.cars[idx] = foundNode.node;
          } else if (!uri.getQueryParamValue(param)) {
            // If carId comes from localstorage and was not found, remove it
            localStorage.removeItem(param);
          }
        }
      });
    }
    initState.uri = uri.toString();

    // Save button enabled?
    if (windowGlobal) {
      initState.saveOk = eachCar((param, idx) => initState.cars[idx] === localStorage.getItem(param))
        .every(val => !!val);
    }

    this.state = initState;

    if (windowGlobal) {
      setTimeout(() => {
        eachCarIndex(editButtonIdx => {
          document.querySelector(`#${editButtonId(editButtonIdx + 1)}`).style.opacity = '1';
        });
      }, 200);
    }
  }

  render() {
    const {
      uri, saveOk, cars, saveMessage,
    } = this.state;

    const {
      location,
    } = this.props;

    const editCar = index => {
      const newUri = new Uri(uri);
      newUri.setPath('/browse');
      newUri.addQueryParam('edit', index);
      window.location.href = newUri.toString();
    };

    const transform = (car, index) => {
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
        <Card
          key={`card-${car.mongodb_id}`}
          marginCard={index === 2}
          empty={!car}
          index={index}
          title={title}
          edit={editCar}
          render={() => (thumbnail)}
          editButtonId={editButtonId(index)}
        />
      );
    };

    const carElements = cars.map((car, idx) => transform(car, idx + 1));

    const onSave = () => {
      const garageName = save(cars);
      this.setState({ saveOk: true, saveMessage: `Garage sauvegardé "${garageName}"` });
      setTimeout(() => this.setState({ saveMessage: null }), 2000); // message will be displayed during 2s
    };

    const title = cars.map(car => (car ? fullname(car) : null))
      .filter(s => !!s)
      .join('\n');

    return (
      <Layout
        location={uri}
        save={onSave}
        title={title}
        uri={uri}
        saveDisabled={saveOk}
        saveMessage={saveMessage}
      >
        <SEO
          location={location.pathname}
          title={title}
          uri={uri}
          description="Créez et partagez votre garage idéal en 3 voitures de sport"
        />
        <Title />
        <article className={indexStyles.carsContainer}>
          {carElements}
        </article>
      </Layout>
    );
  }
}

Garage.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiCars: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            mongodb_id: PropTypes.string.isRequired,
            variant: PropTypes.string.isRequired,
            power: PropTypes.number,
            officialWeight: PropTypes.number,
            weight: PropTypes.number,
            options: PropTypes.string,
            startYear: PropTypes.string,
            endYear: PropTypes.string,
            imageUrl: PropTypes.string,
            selectedFavcarsUrl: PropTypes.string,
            model: PropTypes.shape({
              brand: PropTypes.shape({
                name: PropTypes.string.isRequired,
              }),
              name: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    href: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

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
          imageUrl,
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

export default Garage;
