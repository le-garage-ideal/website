import React, { useState } from 'react';

import Uri from 'jsuri';

import FilteredList from '../app/components/utils/filtered-list';
import ListItem from '../app/components/utils/list-item';
import { Layout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import { extractRelativePathWithParams } from '../functions/url';
import './bulma-theme.scss';
import { useLocation } from '../app/hooks/useLocation';
import { getMessages, I18nContext } from '../functions/i18n';
import { useRouter } from 'next/router';
import { Brand } from '../types/brand';
import { fetchStrapi } from '../functions/api';

type BrandsProps = {
  i18n: any;
  brands: Array<Brand>
};
const Brands = ({ i18n, brands }: BrandsProps) => {
  const location = useLocation();
  const uri = new Uri(location);
  const { push } = useRouter();

  const onBrandSelect = (brandName: string) => {
    uri.setPath(`/models/${brandName}`);
    push(extractRelativePathWithParams(uri));
  };

  const [filteredBrands, setFilteredBrands] = useState(brands);

  const brandComponents = filteredBrands
    .sort((brand1, brand2) => (brand1.name > brand2.name ? 1 : -1))
    .map(brand => (
      <li key={brand.id}>
        <ListItem
          id={brand.id}
          name={brand.name}
          image={brand.image.url}
          onClick={() => onBrandSelect(brand.name)}
        />
      </li>
    ));

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = brands
        .filter((brand) => brand.name.match(new RegExp(value, 'i')));
      setFilteredBrands(filtered);
    }
  };

  const title = i18n['pages.browse.meta.title'];
  return (
    <I18nContext.Provider value={i18n}>
      <Layout uri={uri.toString()} title={title}>
        <SEO
          uri={location}
          title={title}
          description={i18n['pages.browse.meta.description']}
        />
        <FilteredList
          title={i18n['pages.browse.list_title']}
          filter={search}
        >
          {brandComponents}
        </FilteredList>
      </Layout>
    </I18nContext.Provider>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  const i18n = getMessages(locale);
  const brands = await fetchStrapi("GET", `brands`).then(res => res ? res.json() : []);
  return {
    props: {
      i18n,
      brands,
    },
  }
}

export default Brands;
