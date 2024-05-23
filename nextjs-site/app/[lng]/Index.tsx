"use client";

import Uri from 'jsuri';
import { useRouter } from 'next/router';
import { useEffect, useState, useMemo } from 'react';
import { StrapiResponseType } from '../../functions/api';
import { CarsContext, fullname } from '../../functions/cars';
import { save, shouldSave } from '../../functions/storage';
import { extractRelativePathWithParams, processEditParams, getCarParams, addCarsToParams } from '../../functions/url';
import { Car } from '../../types/car';
import { Card } from '../components/car/card';
import { Title } from '../components/title/title';
import { TopButtons } from '../components/topButtons/topButtons';
import { useIsClient } from '../hooks/useIsClient';
import { useLocation } from '../hooks/useLocation';

import indexStyles from './page.module.scss';

type IndexProps = {
  i18nArray: { [s: string]: string };
  allCars: StrapiResponseType<Array<Car>>;
}
export const Index = ({ i18nArray, allCars }: IndexProps) => {
  const [cars, setCars] = useState<Array<Car | undefined>>();
  const [uri, setUri] = useState<Uri | undefined>();
  const [saveState, setSaveState] = useState<{saveMessage: string | undefined; saveOk: boolean;}>({
    saveMessage: undefined,
    saveOk: true,
  });
  const contextValue = useMemo(() => [cars, setCars], [cars, setCars])
  const { saveOk, saveMessage } = saveState;
  const isClient = useIsClient();
  const {location} = useLocation();
  const { push, query } = useRouter();

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
                foundCar.label = fullname(foundCar);
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

  const carElements = cars?.map((car, idx) => transform(car, idx + 1));

  // Click on garage save button
  const onSave = () => {
    if (cars && uri && !saveOk) {
      const garageName = save(cars);
      const newUri = addCarsToParams(cars, uri);
      const savedMessage = i18nArray['pages.index.garage_saved'];
      setSaveState({ saveOk: true, saveMessage: `${savedMessage} "${garageName}"` });
      setUri(newUri);
      setTimeout(() => setSaveState({ saveOk: true, saveMessage: undefined }), 2000); // message will be displayed during 2s
    }
  };

  // Click on edit button on a car's card 
  const editCar = (index: number) => {
    push({ pathname: 'brands', query: { edit: index, ...query }});
  };

  const transform = (car: Car | undefined, index: number) => {
    return (
      <Card
        key={`card-${car ? car.id : index}`}
        marginCard={index === 2}
        car={car}
        index={index}
        OnCardEdit={editCar}
      />
    );
  };

  const carsLabels = cars?.map(car => (car ? fullname(car) : null))?.filter(s => !!s) ?? [];
  const description = carsLabels.length > 0 ? carsLabels.join('\n') : i18nArray['pages.index.meta.description'];

  return (
    <>
      <TopButtons
        save={onSave}
        saveDisabled={saveOk}
        saveMessage={saveMessage}
        showButtons
        i18n={i18nArray}
      />
      <main className={indexStyles.main}>
        <CarsContext.Provider value={contextValue}>
          <Title i18n={i18nArray} />
          <article className={indexStyles.carsContainer}>
            {carElements}
          </article>
        </CarsContext.Provider>
      </main>
    </>
  );
};
