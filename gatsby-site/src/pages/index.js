import Uri from 'jsuri';
import PropTypes from 'prop-types';
import React from 'react';
import { graphql } from 'gatsby';
import './bulma-theme.scss';
import { eachCar, eachCarIndex, fullname } from '../functions/cars';
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
          const foundNode = props.data.allMongodbBmbu7Ynqra11RqiCars.edges
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
    const {
      uri, car1, car2, car3, saveOk, showSaveMessage,
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

    const car1Element = transform(car1, 1);
    const car2Element = transform(car2, 2);
    const car3Element = transform(car3, 3);

    const save = () => {
      eachCar(saveParam => {
        localStorage.setItem(saveParam, this.state[saveParam]);
        this.setState({ saveOk: true, showSaveMessage: true });
        setTimeout(() => this.setState({ showSaveMessage: false }), 2000); // message will be displayed during 2s
      });
    };

    const title = eachCar(car => (this.state[car] ? fullname(this.state[car]) : null))
      .filter(s => !!s)
      .join('\n');

    return (
      <Layout
        location={uri}
        save={save}
        title={title}
        uri={uri}
        saveDisabled={saveOk}
        showSaveMessage={showSaveMessage}
      >
        <SEO
          location={location.pathname}
          title={title}
          uri={uri}
          description="Créez et partagez votre garage idéal en 3 voitures de sport"
        />
        <Title />
        <article className={indexStyles.carsContainer}>
          {car1Element}
          {' '}
          {car2Element}
          {' '}
          {car3Element}
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
