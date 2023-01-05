import React, { useContext, useState } from 'react';
import Uri from 'jsuri';
import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { Layout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { sortCars } from '../../functions/sort';
import { extractRelativePathWithParams } from '../../functions/url';
import { getMessages, I18nContext } from '../../functions/i18n';
import { useRouter } from 'next/router';
import { Car } from '../../types/car';
import { useLocation } from '../../app/hooks/useLocation';
import { fetchStrapi } from '../../functions/api';
import { Model } from '../../types/model';

type CarsProps = {
  i18n: any;
  model: Model;
  cars: Array<Car>;
};
const Cars = ({ i18n, model, cars }: CarsProps) => {
  const { push } = useRouter();
  const location = useLocation();

  const uri = new Uri(location);
  const completeCarList: Array<Car> = cars.sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList);

  const carComponents = filteredCars.map(car => {
    const imageUrl = `/images/${car.id}-resized.jpg`;
    return (
      <li key={car.id}>
        <ListItem
          id={car.id}
          name={car.variant + (car.startYear ? ` - ${car.startYear}` : '')}
          image={imageUrl}
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

  const title = i18n['templates.cars.title']
    .replace('{brand}', model.brand.name)
    .replace('{model}', model.name);

  const description = i18n['templates.cars.description']
    .replace('{brand}', model.brand.name)
    .replace('{model}', model.name);

  return (
    <I18nContext.Provider value={ i18n }>
      <Layout title={title} uri={location}>
        <SEO
          uri={location}
          title={title}
          description={description}
        />
        <FilteredList title={title} filter={search}>
          {carComponents}
        </FilteredList>
      </Layout>
    </I18nContext.Provider>
  );
};

export async function getStaticProps({ locale, params }: { locale: string, params: any }) {
  const i18n = getMessages(locale);
  const model = await fetchStrapi("GET", `models/?filters[name][$eqi]=${params.model}`).then(res => res ? res.json() : undefined);
  if (!model?.data?.id) {
    throw new Error(`No model for [model] param ${params.model}`);
  }
  const cars = await fetchStrapi("GET", `cars?filters[model.id][$eq]=${model.data.id}`).then(res => res ? res.json() : []);
  return {
    props: {
      i18n,
      model,
      cars,
    },
  }
}

export default Cars;
