import React from 'react';
import { BASE_URL } from '../config';


export const CorrectVariants = ({ selectedCars, removeVariant }) => {

  const sortedCars = [...selectedCars];
  sortedCars.sort((e1, e2) => e1.variant > e2.variant ? 1 : e1.variant < e2.variant ? -1 : (1 * e1.startYear) - (1 * e2.startYear));
  const carElements = sortedCars.map((car) => {
    return car ? <div style={ { display: 'flex' } }>
      <button style={ { marginRight: '10px' } } onClick={() => removeVariant(car._id)}>🗑️</button>
      <span style={ { marginRight: '10px' } }>{ car.startYear }</span>
      <span>{ car.variant }</span>
    </div> : '';
  });

  return (
    <>
      {carElements}
    </>
  );

};

