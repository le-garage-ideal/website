"use client";

import { useState } from "react";
import ListItem from "../../components/filtered-list/list-item";
import { Brand } from "../../../types/brand";
import { extractRelativePathWithParams } from "../../../functions/url";
import Uri from "jsuri";
import { useLocation } from "../../hooks/useLocation";
import { useRouter } from "next/navigation";
import FilteredList from "../../components/filtered-list/filtered-list";

export const BrandList = ({ brands, title }: { brands: Array<Brand>; title: string }) => {
  const [filteredBrands, setFilteredBrands] = useState(brands);

  const {location} = useLocation();
  const uri = new Uri(location);
  const { push } = useRouter();

  const onBrandSelect = (brandId: number) => {
    uri.setPath(`/models/${brandId}`);
    push(extractRelativePathWithParams(uri));
  };

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
        .filter((brand) => brand.name.match(new RegExp(value, 'i')));
      setFilteredBrands(filtered);
    }
  };
  return (
    <FilteredList title={title} filter={search}>
      { brandComponents }
    </FilteredList>
  );
};

