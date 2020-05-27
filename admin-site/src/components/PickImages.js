import React from 'react';
import { BASE_URL } from '../config';


export const PickImages = ({ selectedBrand, selectedModel, selectedCars, select, unselect, nomatch }) => {

  const carElements = selectedCars.map((car, carIndex) => {
    if (!car) {
      return '';
    }
    const carVariants = car.favcarsVariants.map(variant => {

      const images = variant.urls.map(url => (
        <button key={car._id + variant.name + url}
          style={{ border: car.selectedFavcarsUrl === url ? '3px solid yellow' : 'none' }}
          onClick={() => select(car._id, variant.name, url)}>
          <img src={url} style={{ maxHeight: '250px' }} />
        </button>)
      );

      const button = car.selectedFavcarsVariant && car.selectedFavcarsVariant === variant.name ?
        <button onClick={() => unselect(car._id, variant.name)}>Unselect</button> : '';

      return (
        <div key={car._id + variant.name}>
          <h4 style={{ textAlign: 'left' }}>{variant.name} {button}</h4>
          <div style={{ display: 'flex' }}>{images}</div>
        </div>
      );

    });

    const noMatchButton = !car.selectedFavcarsVariant ?
      <button onClick={() => nomatch(car._id)}>No match</button> : '';

    if (carVariants && carVariants.length > 0 && !car.selectedFavcarsUrl) {
      return (<div key={car._id}>
        <h3 style={{ textAlign: 'left', color: 'blue' }}>{car.variant} ({car.startYear})
            {noMatchButton}
        </h3>
        <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>{carVariants}</div>
      </div>);
    } else {
      return '';
    }
  });

  const selectedBrandElement = selectedBrand ? (<div><hr />
    <h2>{selectedBrand.name} {selectedModel ? selectedModel.name : ''}</h2>
    <hr /></div>) : '';

  return (
    <>
      {carElements}
    </>
  );

};

