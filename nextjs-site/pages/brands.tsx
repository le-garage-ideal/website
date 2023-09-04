import React, { useState } from 'react';

import Uri from 'jsuri';
import { useTranslation} from 'next-i18next';
import FilteredList from '../app/components/utils/filtered-list';
import ListItem from '../app/components/utils/list-item';
import { FullLayout } from '../app/components/layout';
import { SEO } from '../app/components/seo/seo';
import { extractRelativePathWithParams } from '../functions/url';
import { useLocation } from '../app/hooks/useLocation';
import { useRouter } from 'next/router';
import { Brand } from '../types/brand';
import { fetchStrapi, LIMIT_BRANDS_PARAMS, StrapiResponseType } from '../functions/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type BrandsProps = {
  brands: StrapiResponseType<Array<Brand>>;
};
const Brands = ({ brands }: BrandsProps) => {
  const { t: i18n } = useTranslation();
  const location = useLocation();
  const uri = new Uri(location);
  const { push } = useRouter();

  const onBrandSelect = (brandId: number) => {
    uri.setPath(`/models/${brandId}`);
    push(extractRelativePathWithParams(uri));
  };

  const [filteredBrands, setFilteredBrands] = useState(brands.data);

  const brandComponents = filteredBrands
    .sort((brand1, brand2) => (brand1.name > brand2.name ? 1 : -1))
    .map(brand => (
      <li key={brand.id}>
        <ListItem
          id={brand.id}
          name={brand.name}
          image={brand.image?.url}
          onClick={() => onBrandSelect(brand.id)}
        />
      </li>
    ));

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = brands
        .data
        .filter((brand) => brand.name.match(new RegExp(value, 'i')));
      setFilteredBrands(filtered);
    }
  };

  const title = i18n('pages.brands.meta.title');
  return (
    <FullLayout uri={uri.toString()} title={title}>
      <SEO
        uri={location}
        title={title}
        description={i18n('pages.brands.meta.description')}
      />
      <FilteredList
        title={i18n('pages.brands.list_title')}
        filter={search}
      >
        {brandComponents}
      </FilteredList>
    </FullLayout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  const brands = await fetchStrapi<Array<Brand>>(`brands?populate=*&${LIMIT_BRANDS_PARAMS}`);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      brands,
    },
  }
}

export default Brands;
