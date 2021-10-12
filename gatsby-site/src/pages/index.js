import Uri from 'jsuri';
import PropTypes, { func } from 'prop-types';
import React from 'react';
import { graphql } from 'gatsby';
import { injectIntl } from 'gatsby-plugin-intl';
import './bulma-theme.scss';
import { eachCarIndex, fullname } from '../functions/cars';
import { getSavedGarages, save, shouldSave } from '../functions/storage';
import { processEditParams, getCarParams, addCarsToParams } from '../functions/url';
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

    let uri = new Uri(props.location.href);

    // if edit=X parameter, save car to carX parameter
    const hasEditParams = processEditParams(uri);
    const initState = {
      saveMessage: null,
      saveOk: !hasEditParams,
    };

    // add missing params + save state
    const windowGlobal = typeof window !== 'undefined' && window;
    initState.cars = [];
    if (windowGlobal) {
      // Priority to URL if user copy paste shared garage
      const carParams = getCarParams(uri);
      carParams.forEach((param, idx) => {
        initState.cars[idx] = null;

        if (param) { 
          const { carId, carLabel } = param;

          if (carId) {
            const foundNode = props.data.allMongodbBmbu7Ynqra11RqiCars.edges
              .find(({ node: car }) => car.mongodb_id === carId);

            if (foundNode) {
              initState.cars[idx] = foundNode.node;
              initState.cars[idx].label = carLabel ? carLabel : carLabels(idx + 1, props.intl);
            }
          }
        }
      });

      // If no car found in url, load 1st garage from storage
      if (!initState.cars.some(car => !!car)) {
        const savedGarages = getSavedGarages();
        if (savedGarages.length > 0) {
          [initState.cars] = savedGarages;
          uri = addCarsToParams(initState.cars, uri);
        }
      }
    }
    initState.uri = uri;

    // Save button enabled?
    initState.saveOk = !windowGlobal || !shouldSave(initState.cars);

    this.state = initState;

    if (windowGlobal) {
      history.pushState({foo: 'bar'}, '', uri.toString());
      setTimeout(() => {
        eachCarIndex(editButtonIdx => {
          const editButton = document.querySelector(`#${editButtonId(editButtonIdx + 1)}`);
          if (editButton) {
            editButton.style.opacity = '1';
          }
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
      intl,
    } = this.props;

    // Click on edit button on a car's card 
    const editCar = index => {
      const newUri = new Uri(uri.toString());
      newUri.setPath('/browse');
      newUri.addQueryParam('edit', index);
      window.location.href = newUri.toString();
    };

    // Click on save button of a car's card label
    const editCardLabel = (index, newLabel) => {
      const newCars = [...cars];
      newCars[index].label = newLabel;
      const newUri = addCarsToParams(newCars, uri);
      this.setState({ cars: newCars, saveOk: !shouldSave(cars), uri: newUri });
      history.pushState({foo: 'bar'}, '', newUri.toString());
    };

    const transform = (car, index) => {
      const thumbnail = car ? (
        <Car
          id={carComponentId(index)}
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
          key={`card-${car ? car.mongodb_id : index}`}
          marginCard={index === 2}
          empty={!car}
          index={index}
          label={car ? car.label : carLabels(index, intl)}
          edit={editCar}
          render={() => (thumbnail)}
          editButtonId={editButtonId(index)}
          onLabelChanged={car ? newLabel => editCardLabel(index - 1, newLabel) : null}
        />
      );
    };

    const carElements = cars.map((car, idx) => transform(car, idx + 1));

    // Click on garage save button
    const onSave = () => {
      if (!saveOk) {
        const garageName = save(cars);
        const newUri = addCarsToParams(cars, uri);
        const savedMessage = intl.formatMessage({ id: 'pages.index.garage_saved' });
        this.setState({ saveOk: true, saveMessage: `${savedMessage} "${garageName}"`, uri: newUri });
        setTimeout(() => this.setState({ saveMessage: null }), 2000); // message will be displayed during 2s
      }
    };

    const title = cars.map(car => (car ? fullname(car) : null))
      .filter(s => !!s)
      .join('\n');

    return (
      <Layout
        location={uri.toString()}
        save={onSave}
        title={title}
        uri={uri.toString()}
        saveDisabled={saveOk}
        saveMessage={saveMessage}
        showButtons
      >
        <SEO
          location={location.pathname}
          title={title}
          uri={uri.toString()}
          description={intl.formatMessage({ id: 'pages.index.meta.description' })}
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
  intl: PropTypes.shape({
    formatMessage: func.isRequired,
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

export default injectIntl(Garage);
