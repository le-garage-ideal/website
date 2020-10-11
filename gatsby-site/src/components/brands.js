import React, { useState } from 'react';
import FilteredList from './utils/filtered-list';
import ListItem from './utils/list-item';

export default function Brands({ data, selectedBrand, onBrandSelect }) {
  const [filteredBrands, setFilteredBrands] = useState(data);

  const brandComponents = filteredBrands.map(({ node: brand }) => brand)
    .sort((brand1, brand2) => (brand1.name > brand2.name ? 1 : -1))
    .map(brand => (
      <ListItem
        key={brand.id}
        id={brand.id}
        name={brand.name}
        image={brand.image}
        onClick={() => onBrandSelect(brand.name)}
        selected={selectedBrand && selectedBrand.id === brand.id}
      />
    ));

  const search = value => {
    const filtered = data.filter(({ node: brand }) => brand.name.match(new RegExp(value, 'i')));
    setFilteredBrands(filtered);
  };

  return (
    <FilteredList title="Marques" render={() => brandComponents} filter={search} />
  );
}
