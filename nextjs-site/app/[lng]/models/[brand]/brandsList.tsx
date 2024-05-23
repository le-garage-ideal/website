'use client';

import Uri from "jsuri";
import { useRouter } from "next/router";
import { useState } from "react";
import { extractRelativePathWithParams } from "../../../../functions/url";
import { Car } from "../../../../types/car";
import FilteredList from "../../../components/filtered-list/filtered-list";
import ListItem from "../../../components/filtered-list/list-item";
import { useLocation } from "../../../hooks/useLocation";

export const BrandsList = ({ listName, title }: { listName: Array<Car>, title: string }) => {
  const { push } = useRouter();
  const {location} = useLocation();

  const uri = new Uri(location);
  const [filteredModels, setFilteredModels] = useState(listName);

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = listName.filter(car => car.model.name.match(new RegExp(value, 'i')));
      setFilteredModels(filtered);
    }
  };

  return (
    <FilteredList title={title} filter={search}>
    {
      filteredModels.map(car => (
        <li key={car.model.name}>
          <ListItem
            id={car.model.name}
            name={car.model.name}
            image={car.imageFile?.formats?.thumbnail?.url ?? car.imageFile?.url}
            big
            onClick={() => {
              uri.setPath(`/cars/${car.model.id}`);
              push(extractRelativePathWithParams(uri));
            }}
          >
            {car.model.name}
          </ListItem>
        </li>
      ))
    }
    </FilteredList>
  );
};
