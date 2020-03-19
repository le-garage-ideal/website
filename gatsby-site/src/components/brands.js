import React, { useState } from "react";
import ListItem from "./utils/list-item";
import { FilteredList } from "./utils/filtered-list";


export default function Brands({data, selectedBrand, onBrandSelect}) {

    const [filteredBrands, setFilteredBrands] = useState(data);

    const brandComponents = filteredBrands.map(({ node: brand }) => {
        return (
            <ListItem key={brand.id}
                id={brand.id}
                name={brand.name}
                image={brand.image}
                onClick={() => onBrandSelect(brand.name)}
                selected={selectedBrand && selectedBrand.id === brand.id}>
            </ListItem>
        )
    });

    const search = value => {
        const filtered = data.filter(({ node: brand }) => brand.name.match(new RegExp(value, 'i')));
        setFilteredBrands(filtered);
    };

    return (
        <FilteredList title="Marques" render={() => brandComponents} filter={search} />
    );
}