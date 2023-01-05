import React, { useContext, useState } from 'react';
import Uri from 'jsuri';
import { sortModels } from '../../functions/sort';
import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { Layout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { extractRelativePathWithParams } from '../../functions/url';
import { getMessages, I18nContext } from '../../functions/i18n';
import { Car } from '../../types/car';
import { useLocation } from '../../app/hooks/useLocation';
import { useRouter } from 'next/router';
import { fetchStrapi } from '../../functions/api';
import { Brand } from '../../types/brand';

type ModelsProps = {
  i18n: any;
  brand: Brand;
  cars: Array<Car>;
};
const Models = ({ i18n, brand, cars }: ModelsProps) => {
  const { push } = useRouter();
  const location = useLocation();

  const uri = new Uri(location);
  const listName: Array<Car> = cars
    .sort((a, b) => sortModels(a.model, b.model))
    .reduce((acc, el) => (
      acc[acc.length - 1] && acc[acc.length - 1].model.name === el.model.name ?
        acc
        :
        [...acc, el]
    ), new Array<Car>());
  const [filteredModels, setFilteredModels] = useState(listName);

  const modelComponents = filteredModels.map(car => (
    <li key={car.model.name}>
      <ListItem
        id={car.model.name}
        name={car.model.name}
        image={`/images/${car.id}-resized.jpg`}
        big
        onClick={() => {
          uri.setPath(`/cars/${car.model.brand.name}/${car.model.name}`);
          push(extractRelativePathWithParams(uri));
        }}
      />
    </li>
  ));

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = listName.filter(car => car.model.name.match(new RegExp(value, 'i')));
      setFilteredModels(filtered);
    }
  };

  const title = i18n['templates.models.title']
    .replace('{brand}', brand.name);

  const description = i18n['templates.models.description']
    .replace('{brand}', brand.name);

  return (
    <I18nContext.Provider value={ i18n }>
      <Layout title={title} uri={location}>
        <SEO
          uri={location}
          title={title}
          description={description}
        />
        <FilteredList title={title} filter={search}>
          {modelComponents}
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

export default Models;
