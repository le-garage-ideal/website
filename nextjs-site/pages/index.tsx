import Head from 'next/head';
import Uri from 'jsuri';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation} from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import { fullname, CarsContext } from '../functions/cars';
import { save, shouldSave } from '../functions/storage';
import {
  processEditParams,
  getCarParams,
  addCarsToParams,
  extractRelativePathWithParams
} from '../functions/url';
import indexStyles from './index.module.scss';
import { Card } from '../app/components/utils/card';
import { Title } from '../app/components/title/title';
import { FullLayout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import { Car } from '../types/car';
import { Car as CarComponent } from '../app/components/car/car';
import { fetchStrapi, LIMIT_CARS_PARAMS, POPULATE_CARS_PARAMS, StrapiResponseType } from '../functions/api';
import { useIsClient } from '../app/hooks/useIsClient';
import { useLocation } from '../app/hooks/useLocation';

type IndexPageProps = {
  allCars: StrapiResponseType<Array<Car>>;
  locale: string;
};
const IndexPage = ({ allCars }: IndexPageProps) => {
  const [cars, setCars] = useState<Array<Car | undefined>>();
  const { t: i18n } = useTranslation();
  const [uri, setUri] = useState<Uri | undefined>();
  const {location} = useLocation();

  const { push, query } = useRouter();

  const [saveState, setSaveState] = useState<{saveMessage: string | undefined; saveOk: boolean;}>({
    saveMessage: undefined,
    saveOk: true,
  });
  const contextValue = useMemo(() => [cars, setCars], [cars, setCars])
  const { saveOk, saveMessage } = saveState;
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      // Retrieve URL params and set uri state, push new params to browser location
      if (!uri && location) {
        const tmpUri = new Uri(location);
        const relativePathWithParams = extractRelativePathWithParams(tmpUri);
        const initUri = new Uri(relativePathWithParams);
        // if edit=X parameter, save car to carX parameter
        const paramsChanged = processEditParams(initUri);
        if (paramsChanged) {
          let query = initUri.query();
          if (query.charAt(0) === '?') {
            query = query.slice(1);
          }
          push({ query }, undefined, { shallow: true });
        }
        setUri(initUri);
        setSaveState({
          saveMessage: undefined,
          saveOk: !paramsChanged,
        });
      }

      // Retrieve cars data and set cars state
      const carsInit: Array<Car | undefined> = [];
      const carParams = getCarParams(uri);
      if (carParams.length > 0) {
        // add missing params + save state
        // Priority to URL if user copy paste shared garage
        const carParams = getCarParams(uri);
        carParams.forEach((param, idx) => {
          carsInit[idx] = undefined;

          if (param?.carId) {
            const { carId, carLabel } = param;
            const carIdNumber = parseInt(carId);
            if (!isNaN(carIdNumber)) {
              const foundCar = allCars.data
                .find((car) => car.id === carIdNumber) as Car;

              if (foundCar) {
                foundCar.label = carLabel ? carLabel : fullname(foundCar);
                carsInit[idx] = foundCar;
              }
            }
          }
        });

        if (carsInit.length > 0) {
          setCars(carsInit);
        }
        
        // Save button enabled?
        setSaveState({ saveMessage: undefined, saveOk: !shouldSave(carsInit) });
      }
    }
  }, [isClient, uri, setUri, push, setSaveState, location, allCars.data]);

  // Click on edit button on a car's card 
  const editCar = (index: number) => {
    push({ pathname: 'brands', query: { edit: index, ...query }});
  };

  // Click on save button of a car's card label
  const editCardLabel = (index: number, newLabel: string) => {
    const newCar = cars?.[index];
    if (newCar && uri) {
      newCar.label = newLabel;
      const newUri = addCarsToParams(cars, uri);
      setCars(cars);
      setSaveState({ saveOk: !shouldSave(cars), saveMessage: undefined });
      setUri(newUri);
      history.pushState({ foo: 'bar' }, '', newUri.path());
    }
  };

  const transform = (car: Car | undefined, index: number) => {
    return (
      <Card
        key={`card-${car ? car.id : index}`}
        marginCard={index === 2}
        empty={!car}
        label={car?.label ?? car ? fullname(car) : ''}
        onLabelChanged={car ? (newLabel: string) => editCardLabel(index - 1, newLabel) : (s: string) => {}}
      >
        <CarComponent
          className={indexStyles.carComponent}
          car={car}
          index={index}
          edit={editCar}
        />
      </Card>
    );
  };

  const carElements = cars?.map((car, idx) => transform(car, idx + 1));

  // Click on garage save button
  const onSave = () => {
    if (cars && uri && !saveOk) {
      const garageName = save(cars);
      const newUri = addCarsToParams(cars, uri);
      const savedMessage = i18n('pages.index.garage_saved');
      setSaveState({ saveOk: true, saveMessage: `${savedMessage} "${garageName}"` });
      setUri(newUri);
      setTimeout(() => setSaveState({ saveOk: true, saveMessage: undefined }), 2000); // message will be displayed during 2s
    }
  };

  const title = cars?.map(car => (car ? fullname(car) : null))
    ?.filter(s => !!s)
    ?.join('\n') ?? '';
  
  return (
    <>
      <Head>
        <SEO title="Home" uri={''} description={''} />
      </Head>
      <main className={indexStyles.main}>
        <CarsContext.Provider value={contextValue}>
          <FullLayout
            save={onSave}
            title={title}
            uri={uri?.toString()}
            saveDisabled={saveOk}
            saveMessage={saveMessage}
            showButtons
          >
            <SEO
              title={title}
              uri={uri?.toString()}
              description={i18n('pages.index.meta.description')}
            />
            <Title />
            <article className={indexStyles.carsContainer}>
              {carElements}
            </article>
          </FullLayout>
        </CarsContext.Provider>
      </main>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  const allCars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&${LIMIT_CARS_PARAMS}`);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      allCars,
    },
  }
}


export default IndexPage;
