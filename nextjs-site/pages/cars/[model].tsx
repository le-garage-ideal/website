import { useState } from 'react';
import Uri from 'jsuri';
import { useTranslation} from 'next-export-i18n';

import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { FullLayout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { sortCars } from '../../functions/sort';
import { extractRelativePathWithParams } from '../../functions/url';
import { useRouter } from 'next/router';
import { Car } from '../../types/car';
import { useLocation } from '../../app/hooks/useLocation';
import { fetchStrapi } from '../../functions/api';
import { Model } from '../../types/model';

type CarsProps = {
  model: Model;
  cars: Array<Car>;
};
const Cars = ({ model, cars }: CarsProps) => {
  const { push } = useRouter();
  const location = useLocation();
  const { t: i18n } = useTranslation();

  const uri = new Uri(location);
  const completeCarList: Array<Car> = cars.sort(sortCars);
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
    .replace('{brand}', model.brand.name)
    .replace('{model}', model.name);

  const description = i18n('templates.cars.description')
    .replace('{brand}', model.brand.name)
    .replace('{model}', model.name);

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
  const models = await fetchStrapi<Array<Model>>('models');
  return {
    paths: models.map(model => ({ params: { model: `${model.id}` } })),
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps({ locale, params }: { locale: string, params: any }) {
  const model = await fetchStrapi<Model>(`models/${params.model}?populate=*`);
  if (!model) {
    throw new Error(`No model for [model] param ${params.model}`);
  }
  const cars = await fetchStrapi<Array<Car>>(`cars?populate[model][populate][0]=brand&populate[0]=imageFile&filters[model][id][$eqi]=${params.model}`);
  return {
    props: {
      model,
      cars,
    },
  }
}

export default Cars;
