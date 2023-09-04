import { useState } from 'react';
import Uri from 'jsuri';
import { useTranslation} from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { FullLayout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { sortCars } from '../../functions/sort';
import { extractRelativePathWithParams } from '../../functions/url';
import { useRouter } from 'next/router';
import { Car } from '../../types/car';
import { useLocation } from '../../app/hooks/useLocation';
import { fetchStrapi, LIMIT_CARS_PER_MODEL_PARAMS, LIMIT_MODELS_PARAMS, POPULATE_CARS_PARAMS, StrapiResponseType } from '../../functions/api';
import { Model } from '../../types/model';

type CarsProps = {
  model: StrapiResponseType<Model>;
  cars: StrapiResponseType<Array<Car>>;
};
const Cars = ({ model, cars }: CarsProps) => {
  const { push } = useRouter();
  const location = useLocation();
  const { t: i18n } = useTranslation();

  const uri = new Uri(location);
  const completeCarList: Array<Car> = cars.data.sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList);

  const carComponents = filteredCars.map(car => {
    return (
      <li key={car.id}>
        <ListItem
          id={car.id}
          name={car.variant + (car.startYear ? ` - ${car.startYear}` : '')}
          image={car.imageFile?.url}
          big
          onClick={() => {
            uri.addQueryParam('car', car.id);
            uri.setPath('/');
            push(extractRelativePathWithParams(uri));
          }}
        />
      </li>
    );
  });

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = completeCarList.filter(car => car.variant.match(new RegExp(value, 'i')));
      setFilteredCars(filtered);
    }
  };

  const title = i18n('templates.cars.title')
    .replace('{brand}', model.data.brand.name)
    .replace('{model}', model.data.name);

  const description = i18n('templates.cars.description')
    .replace('{brand}', model.data.brand.name)
    .replace('{model}', model.data.name);

  return (
    <FullLayout title={title} uri={location}>
      <SEO
        uri={location}
        title={title}
        description={description}
      />
      <FilteredList title={title} filter={search}>
        {carComponents}
      </FilteredList>
    </FullLayout>
  );
};

export async function getStaticPaths() {
  const models = await fetchStrapi<Array<Model>>(`models?${LIMIT_MODELS_PARAMS}`);
  return {
    paths: models?.data.flatMap(model => ([
      { params: { model: `${model.id}` }, locale: 'en' },
      { params: { model: `${model.id}` }, locale: 'fr' },
    ])),
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps({ locale, params }: { locale: string, params: any }) {
  const model = await fetchStrapi<Model>(`models/${params.model}?populate=*`);
  if (!model) {
    throw new Error(`No model for [model] param ${params.model}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?${POPULATE_CARS_PARAMS}&filters[model][id][$eqi]=${params.model}&${LIMIT_CARS_PER_MODEL_PARAMS}`);
  if (!model) {
    throw new Error(`No car for [model] param ${params.model}`);
  }
  return {
    props: {
      model,
      cars,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  }
}

export default Cars;
