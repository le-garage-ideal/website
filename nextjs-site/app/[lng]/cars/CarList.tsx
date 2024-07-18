"use client";

import { useState } from "react";
import Uri from "jsuri";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { extractRelativePathWithParams } from "../../../functions/url";
import { Car } from "../../../types/car";
import FilteredList from "../../components/filtered-list/filtered-list";
import ListItem from "../../components/filtered-list/list-item";
import { useLocation } from "../../hooks/useLocation";

import carsStyles from './cars.module.scss';

type CarListProps = {
  cars: Array<Car>;
  i18nArray: { [s: string]: string };
  numberOfCars: number;
  lng: string;
};
export const CarList = ({ cars, i18nArray, numberOfCars, lng }: CarListProps) => {
  const { push } = useRouter();
  const { location } = useLocation();
  const uri = new Uri(location);

  const [filteredCars, setFilteredCars] = useState(cars.slice(0, 20));
  const [selectedCar, setSelectedCar] = useState<number>();

  const validateCar = (index: number, id: number | string) => {
    uri.addQueryParam(`car${index}`, id);
    uri.deleteQueryParam('edit');
    uri.setPath(lng);
    const path = extractRelativePathWithParams(uri);
    push(path);
  };

  const carComponents = filteredCars.map(car => {
    const isSelected = selectedCar === car.id;
    const name = `${car.model.brand.name} ${car.variant} ${(car.startYear ? ' - ' + car.startYear : '')}`;
    return (
      <li key={`carItem${car.id}`}>
        <ListItem
          id={car.id}
          name={name}
          image={car.imageFile?.formats?.thumbnail?.url ?? car.imageFile?.url}
          big
          selected={false}
          onClick={() => setSelectedCar(car.id)}
        >
          <div className={carsStyles.carTitle}>{name}</div>
          {
            isSelected
            && (
              <div className={carsStyles.carSelectionBox}>
                <label className={carsStyles.radioLabel}>
                  <input type="radio" name="#1" onChange={() => validateCar(1, car.id)} />
                  <span>#1</span>
                </label>
                <label className={carsStyles.radioLabel}>
                  <input type="radio" name="#2" onChange={() => validateCar(2, car.id)} />
                  <span>#2</span>
                </label>
                <label className={carsStyles.radioLabel}>
                  <input type="radio" name="#3" onChange={() => validateCar(3, car.id)} />
                  <span>#3</span>
                </label>
              </div>
            )
          }
        </ListItem>
      </li>
    );
  });

  const search = (value: string | undefined) => {
    if (value) {
      const regex = new RegExp(value, 'i');
      const filtered = cars.filter(car => car.variant.match(regex) || car.model.brand.name.match(regex));
      setFilteredCars(filtered);
    }
  };

  return (
    <FilteredList
      title={`${numberOfCars} ${i18nArray['pages.cars.list_title']}`}
      filter={search}
    >
      {carComponents}
    </FilteredList>
  );
};