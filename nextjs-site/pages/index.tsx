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
import { Card } from '../app/components/utils/card';
import { Title } from '../app/components/title/title';
import { FullLayout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import { Car } from '../types/car';
import { carLabels, getMessages, I18nContext } from '../functions/i18n';
import { useLocation } from '../app/hooks/useLocation';
import { useRouter } from 'next/router';
import { Car as CarComponent } from '../app/components/car/car';
import { fetchStrapi } from '../functions/api';

type IndexPageProps = {
  i18n: any;
  allCars: Array<Car>;
};
const IndexPage = ({ i18n, allCars }: IndexPageProps) => {
  const [cars, setCars] = useState<Array<Car | undefined>>();

  const location = useLocation();
  const initUri = new Uri(extractRelativePathWithParams(new Uri(location)));
  const [uri, setUri] = useState(initUri);

  const { push } = useRouter();

  // if edit=X parameter, save car to carX parameter
  const hasEditParams = processEditParams(uri);
  const [saveState, setSaveState] = useState<{saveMessage: string | undefined; saveOk: boolean;}>({
    saveMessage: undefined,
    saveOk: !hasEditParams,
  });
  const contextValue = useMemo(() => [cars, setCars], [cars, setCars])
  const { saveOk, saveMessage } = saveState;
  useEffect(() => {
    const clientMode = typeof window !== 'undefined' && window;
    const carsInit: Array<Car | undefined> = [];
    if (!cars) {
      // add missing params + save state
      if (clientMode) {
        // Priority to URL if user copy paste shared garage
        const carParams = getCarParams(uri);
        carParams.forEach((param, idx) => {
          carsInit[idx] = undefined;

          if (param) {
            const { carId, carLabel } = param;
            const carIdNumber = parseInt(carId);
            if (!isNaN(carIdNumber)) {
              const foundNode = allCars
                .find((car) => car.id === carIdNumber) as Car;

              if (foundNode) {
                foundNode.label = carLabel ? carLabel : carLabels(i18n, idx + 1);
                carsInit[idx] = foundNode;
              }
            }
          }
        });

        setCars(carsInit);
      }
    }

    // Save button enabled?
    setSaveState({ ...saveState, saveOk: !(clientMode && shouldSave(carsInit)) });


    if (clientMode) {
      history.pushState({ foo: 'bar' }, '', uri.path());
      setTimeout(() => {
        eachCarIndex(editButtonIdx => {
          const editButton = document.querySelector(`#${editButtonId(editButtonIdx + 1)}`) as HTMLElement;
          if (editButton) {
            editButton.style.opacity = '1';
          }
        });
      }, 200);
    }
  }, [cars, allCars, i18n, saveState, uri]);

  // Click on edit button on a car's card 
  const editCar = (index: number) => {
    const newUri = new Uri(uri.toString());
    newUri.setPath('/browse');
    newUri.addQueryParam('edit', index);
    push(extractRelativePathWithParams(newUri));
  };

  // Click on save button of a car's card label
  const editCardLabel = (index: number, newLabel: string) => {
    const newCar = cars?.[index];
    if (newCar) {
      newCar.label = newLabel;
      const newUri = addCarsToParams(cars, uri);
      setCars(cars);
      setSaveState({ saveOk: !shouldSave(cars), saveMessage: undefined });
      setUri(newUri);
      history.pushState({ foo: 'bar' }, '', newUri.path());
    }
  };

  const transform = (car: Car | undefined, index: number) => {
    const thumbnail = car ? (
      <CarComponent
        id={carComponentId(index)}
        className={indexStyles.carComponent}
        car={car}
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
        label={car ? car.label : carLabels(i18n, index)}
        edit={editCar}
        render={() => (thumbnail)}
        editButtonId={editButtonId(index)}
        onLabelChanged={car ? (newLabel: string) => editCardLabel(index - 1, newLabel) : null}
      />
    );
  };

  const carElements = cars?.map((car, idx) => transform(car, idx + 1));

  // Click on garage save button
  const onSave = () => {
    if (cars && !saveOk) {
      const garageName = save(cars);
      const newUri = addCarsToParams(cars, uri);
      const savedMessage = i18n['pages.index.garage_saved'];
      setSaveState({ saveOk: true, saveMessage: `${savedMessage} "${garageName}"` });
      setUri(newUri);
      setTimeout(() => setSaveState({ saveOk: true, saveMessage: undefined }), 2000); // message will be displayed during 2s
    }
  };

  const title = cars?.map(car => (car ? fullname(car) : null))
    ?.filter(s => !!s)
    ?.join('\n') ?? '';
  
  return (
    <I18nContext.Provider value={ i18n }>
      <Head>
        <SEO title="Home" uri={''} description={''} />
      </Head>
      <main>
        <CarsContext.Provider value={contextValue}>
          <FullLayout
            save={onSave}
            title={title}
            uri={uri.toString()}
            saveDisabled={saveOk}
            saveMessage={saveMessage}
            showButtons
          >
            <SEO
              title={title}
              uri={uri.toString()}
              description={i18n['pages.index.meta.description']}
            />
            <Title />
            <article className={indexStyles.carsContainer}>
              {carElements}
            </article>
          </FullLayout>
        </CarsContext.Provider>
      </main>
    </I18nContext.Provider>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  const i18n = getMessages(locale);
  const allCars = await fetchStrapi<Array<Car>>("GET", `cars`);
  return {
    props: {
      i18n,
      allCars,
    },
  }
}

const carComponentId = (index: number) => `car-${index}`;
const editButtonId = (index: number) => `edit-${index}`;

export default IndexPage;
