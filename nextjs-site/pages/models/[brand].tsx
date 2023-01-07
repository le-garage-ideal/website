import React, { useState } from 'react';
import Uri from 'jsuri';
import { useTranslation} from 'next-export-i18n';

import { sortModels } from '../../functions/sort';
import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { FullLayout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { extractRelativePathWithParams } from '../../functions/url';
import { Car } from '../../types/car';
import { useLocation } from '../../app/hooks/useLocation';
import { useRouter } from 'next/router';
import { fetchStrapi } from '../../functions/api';
import { Brand } from '../../types/brand';
import { Model } from '../../types/model';

type ModelsProps = {
  brand: Brand;
  cars: Array<Car>;
};
const Models = ({ brand, cars }: ModelsProps) => {
  const { t: i18n } = useTranslation();
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
          uri.setPath(`/cars/${car.model.id}`);
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

  const title = i18n('templates.models.title')
    .replace('{brand}', brand.name);

  const description = i18n('templates.models.description')
    .replace('{brand}', brand.name);

  return (
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
  );
};

export async function getStaticPaths() {
  const brands = await fetchStrapi<Array<Model>>('brands');
  return {
    paths: brands.map(brand => ({ params: { brand: `${brand.id}` } })),
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps({ locale, params }: { locale: string, params: any }) {
  const brand = await fetchStrapi<Brand>(`brands/${params.brand}?populate=*`);
  if (!brand) {
    throw new Error(`No brand for [brand] param ${params.brand}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?populate[model][populate][0]=brand&populate[0]=imageFile&filters[model][brand][id][$eq]=${brand.id}`);
  if (!cars?.length) {
    throw new Error(`No cars for [brand] param ${params.brand}`);
  }
  return {
    props: {
      brand,
      cars,
    },
  }
}

export default Models;
