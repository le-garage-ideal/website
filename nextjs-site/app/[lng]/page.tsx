"use client";

import Uri from 'jsuri';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';

import { fullname, CarsContext } from '../../functions/cars';
import { save, shouldSave } from '../../functions/storage';
import {
  processEditParams,
  getCarParams,
  addCarsToParams,
  extractRelativePathWithParams
} from '../../functions/url';
import indexStyles from './page.module.scss';
import { Card } from '../components/car/card';
import { Title } from '../components/title/title';
import { Car } from '../../types/car';
import {
  fetchStrapi,
  LIMIT_CARS_PARAMS,
  POPULATE_CARS_PARAMS,
  StrapiResponseType
} from '../../functions/api';
import { useIsClient } from '../hooks/useIsClient';
import { useLocation } from '../hooks/useLocation';
import { TopButtons } from '../components/topButtons/topButtons';
import { I18nParamsType } from '../../types/i18n';
import { useTranslation } from '../i18n';

type IndexPageProps = I18nParamsType & {
  allCars: StrapiResponseType<Array<Car>>;
  locale: string;
};
const IndexPage = async ({ allCars, params: { lng } }: IndexPageProps) => {
  const [cars, setCars] = useState<Array<Car | undefined>>();
  const { t: i18n } = await useTranslation(lng, 'common');
  const [uri, setUri] = useState<Uri | undefined>();
  const {location} = useLocation();

  const { push, query } = useRouter();

  const i18nArray = {
    'components.layout.saved_button_tooltip_ko': i18n('components.layout.saved_button_tooltip_ko'),
    'components.layout.saved_button_tooltip_ok': i18n('components.layout.saved_button_tooltip_ok'),
    'components.layout.link_clipboard_ko': i18n('components.layout.link_clipboard_ko'),
    'components.layout.link_clipboard_ok': i18n('components.layout.link_clipboard_ok'),
    'components.layout.share_with_facebook': i18n('components.layout.share_with_facebook'),
    'components.layout.share_with_twitter': i18n('components.layout.share_with_twitter'),
    'components.layout.share_with_reddit': i18n('components.layout.share_with_reddit'),
    'components.layout.share_title': i18n('components.layout.share_title'),
    'components.layout.link_share_it': i18n('components.layout.link_share_it'),
    'components.layout.share_link': i18n('components.layout.share_link'),
    'components.title.subtitle': i18n('components.title.subtitle'),
    'components.title.title': i18n('components.title.title'),
  };

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

  const carsLabels = cars?.map(car => (car ? fullname(car) : null))?.filter(s => !!s) ?? [];
  const description = carsLabels.length > 0 ? carsLabels.join('\n') : i18n('pages.index.meta.description');

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

export async function getStaticProps({ locale }: { locale: string }) {
  const allCars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&${LIMIT_CARS_PARAMS}`);
  return {
    props: { allCars },
  }
}


export default IndexPage;
