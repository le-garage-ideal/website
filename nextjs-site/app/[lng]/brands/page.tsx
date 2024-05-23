"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Uri from 'jsuri';

import FilteredList from '../../components/filtered-list/filtered-list';
import ListItem from '../../components/filtered-list/list-item';
import { extractRelativePathWithParams } from '../../../functions/url';
import { useLocation } from '../../hooks/useLocation';
import { Brand } from '../../../types/brand';
import { fetchStrapi, LIMIT_BRANDS_PARAMS, StrapiResponseType } from '../../../functions/api';
import { useTranslation } from '../../i18n';

type BrandsProps = {
  params: {
    brands: StrapiResponseType<Array<Brand>>;
    lng: string;
  }
};
export default async function Brands({ params: { brands, lng } }: BrandsProps) {
  const { t: i18n } = await useTranslation(lng, 'common');
  const {location} = useLocation();
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
        >
          {brand.name}
        </ListItem>
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

  return (
    <FilteredList
      title={i18n('pages.brands.list_title')}
      filter={search}
    >
      {brandComponents}
    </FilteredList>
  );
}

export async function generateStaticParams({ locale }: { locale: string }) {
  const brands = await fetchStrapi<Array<Brand>>(`brands?populate=*&${LIMIT_BRANDS_PARAMS}`);
  return brands;
}

