"use client";

import Uri from "jsuri";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sortCars } from "../../../../functions/sort";
import { extractRelativePathWithParams } from "../../../../functions/url";
import { Car } from "../../../../types/car";
import FilteredList from "../../../components/filtered-list/filtered-list";
import ListItem from "../../../components/filtered-list/list-item";
import { useLocation } from "../../../hooks/useLocation";

export const CarList = ({ cars, title, lng }: { cars: Array<Car>; title: string, lng: string }) => {
  const { push } = useRouter();
  const { location } = useLocation();
  const uri = new Uri(location);
  const completeCarList: Array<Car> = cars.sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList);

  const carComponents = filteredCars.map(car => {
    const name = car.variant + (car.startYear ? ` - ${car.startYear}` : '');
    return (
      <li key={car.id}>
        <ListItem
          id={car.id}
          name={name}
          image={car.imageFile?.formats?.thumbnail?.url ?? car.imageFile?.url}
          big
          onClick={() => {
            const carIndex = uri.getQueryParamValue('edit');
            uri.deleteQueryParam('edit');
            uri.addQueryParam(`car${carIndex}`, car.id);
            uri.setPath(lng);
            const path = extractRelativePathWithParams(uri);
            push(path);
          }}
        >
          {name}
        </ListItem>
      </li>
    );
  });

  const search = (value: string | undefined) => {
    if (value) {
      const filtered = completeCarList.filter(car => car.variant.match(new RegExp(value, 'i')));
      setFilteredCars(filtered);
    }
  };

  return (
    <FilteredList title={title} filter={search}>
      {carComponents}
    </FilteredList>
  );
};