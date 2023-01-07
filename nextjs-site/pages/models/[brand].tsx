import React, { useContext, useState } from 'react';
import Uri from 'jsuri';
import { sortModels } from '../../functions/sort';
import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { FullLayout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { extractRelativePathWithParams } from '../../functions/url';
import { getMessages, I18nContext } from '../../functions/i18n';
import { Car } from '../../types/car';
import { useLocation } from '../../app/hooks/useLocation';
import { useRouter } from 'next/router';
import { fetchStrapi } from '../../functions/api';
import { Brand } from '../../types/brand';
import { Model } from '../../types/model';

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
        image={car.imageFile?.url}
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
      <FullLayout title={title} uri={location}>
        <SEO
          uri={location}
          title={title}
          description={description}
        />
        <FilteredList title={title} filter={search}>
          {modelComponents}
        </FilteredList>
      </FullLayout>
    </I18nContext.Provider>
  );
};

export async function getStaticProps({ locale, params }: { locale: string, params: any }) {
  const i18n = getMessages(locale);
  const models = await fetchStrapi<Array<Model>>("GET", `models/?filters[name][$eqi]=${params.model}`);
  if (models.length === 0) {
    throw new Error(`No model for [model] param ${params.model}`);
  }
  const model = models[0];
  const cars = await fetchStrapi<Array<Car>>("GET", `cars?filters[model.id][$eq]=${model.id}`);
  return {
    props: {
      i18n,
      model,
      cars,
    },
  }
}

export default Models;
