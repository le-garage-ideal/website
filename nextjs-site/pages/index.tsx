import Head from 'next/head';
import Image from 'next/image';

import Uri from 'jsuri';
import React, { useEffect, useState, useMemo } from 'react';
import { eachCarIndex, fullname, CarsContext } from '../functions/cars';
import { save, shouldSave } from '../functions/storage';
import {
  processEditParams,
  getCarParams,
  addCarsToParams,
  extractRelativePathWithParams
} from '../functions/url';
import indexStyles from '../styles/Home.module.css';
import { carLabels } from '../app/constants';
import { Card } from '../app/components/utils/card';
import { Title } from '../app/components/title/title';
import { Layout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import { Car } from '../types/car';
import { getMessages, I18nContext } from '../functions/i18n';

type IndexPageType = { i18n: any };
const IndexPage = ({ i18n }: IndexPageType) => {
  const [cars, setCars] = useState<Array<Car>>([]);

  const initUri = new Uri(extractRelativePathWithParams(new Uri(location.href)));
  const [uri, setUri] = useState(initUri);

  // if edit=X parameter, save car to carX parameter
  const hasEditParams = processEditParams(uri);
  const [saveState, setSaveState] = useState({
    saveMessage: null,
    saveOk: !hasEditParams,
  });
  const contextValue = useMemo(() => [cars, setCars], [cars, setCars])
  const { saveOk, saveMessage } = saveState;
  useEffect(() => {
    // add missing params + save state
    const windowGlobal = typeof window !== 'undefined' && window;
    const newCars = [...cars];
    if (windowGlobal) {
      // Priority to URL if user copy paste shared garage
      const carParams = getCarParams(uri);
      carParams.forEach((param, idx) => {
        newCars[idx] = undefined;

        if (param) {
          const { carId, carLabel } = param;

          if (carId) {
            const foundNode = data.allMongodbBmbu7Ynqra11RqiCars.edges
              .find(({ node: car }) => car.id === carId);

            if (foundNode) {
              newCars[idx] = foundNode;
              newCars[idx].label = carLabel ? carLabel : carLabels(idx + 1, intl);
            }
          }
        }
      });

      setCars(newCars);
    }

    // Save button enabled?
    setSaveState({ ...saveState, saveOk: !windowGlobal || !shouldSave(newCars) });


    if (windowGlobal) {
      history.pushState({ foo: 'bar' }, '', uri.path());
      setTimeout(() => {
        eachCarIndex(editButtonIdx => {
          const editButton = document.querySelector(`#${editButtonId(editButtonIdx + 1)}`);
          if (editButton) {
            editButton.style.opacity = '1';
          }
        });
      }, 200);
    }
  }, []);

  // Click on edit button on a car's card 
  const editCar = index => {
    const newUri = new Uri(uri.toString());
    newUri.setPath('/browse');
    newUri.addQueryParam('edit', index);
    navigate(extractRelativePathWithParams(newUri));
  };

  // Click on save button of a car's card label
  const editCardLabel = (index, newLabel) => {
    const newCars = [...cars];
    newCars[index].label = newLabel;
    const newUri = addCarsToParams(newCars, uri);
    setCars(newCars);
    setSaveState({ saveOk: !shouldSave(cars) });
    setUri(newUri);
    history.pushState({ foo: 'bar' }, '', newUri.path());
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
        key={`card-${car ? car.id : index}`}
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
      const savedMessage = i18n['pages.index.garage_saved'];
      setSaveState({ saveOk: true, saveMessage: `${savedMessage} "${garageName}"` });
      setUri(newUri);
      setTimeout(() => setSaveState({ saveMessage: null }), 2000); // message will be displayed during 2s
    }
  };

  const title = cars.map(car => (car ? fullname(car) : null))
    .filter(s => !!s)
    .join('\n');
  
  return (
    <I18nContext.Provider value={ i18n }>
      <Head>
        <Seo title="Home" />
      </Head>
      <main>
        <CarsContext.Provider value={contextValue}>
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
              description={i18n['pages.index.meta.description']}
            />
            <Title />
            <article className={indexStyles.carsContainer}>
              {carElements}
            </article>
          </Layout>
        </CarsContext.Provider>
      </main>
    </I18nContext.Provider>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  const i18n = getMessages(locale);
  return {
    props: {
      i18n,
    },
  }
}


export default IndexPage;
