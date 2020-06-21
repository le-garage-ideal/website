import React from 'react';
import { BASE_URL } from '../config';


export const CorrectVariants = ({ selectedModel, selectedCars, removeVariant }) => {

  const carElements = selectedCars.map(car => {
    return car ? <div key={car._id} style={ { display: 'flex' } }>
      <button style={ { marginRight: '10px', backgroundColor: car.selectedFavcarsUrl ? 'lightgreen' : 'red' } } onClick={() => removeVariant(car._id)}>🗑️</button>
      <span style={ { marginRight: '10px' } }>{ car.startYear }</span>
      <span>{ car.variant }</span>
    </div> : '';
  });

  return (
    <section style={ { display: 'flex' } }>
      <section>{carElements}</section>
      <form action={BASE_URL + '/cars'}>
        <input type="text" name="variant" placeholder="variant"></input>
        <input type="text" name="power" placeholder="power"></input>
        <input type="text" name="real-weight" placeholder="real weight"></input>
        <input type="text" name="official-weight" placeholder="official weight"></input>
        <input type="text" name="options" placeholder="options"></input>
        <input type="hidden" name="model-id" value={ selectedModel._id }></input>
        <button type="submit" onClick={() => console.log('add')}>OK</button>
      </form>
    </section>
  );

};

