import React from 'react';


export const PickImages = ({ selectedBrand, selectedModel, selectedCars, select, unselect, nomatch }) => {

  const carElements = selectedCars.map((car, carIndex) => {
    if (!car) {
      return '';
    }
    const carVariants = car.favcarsVariants.map(variant => {

      const imagesToSelect = variant.urls.map(url => (
        <button key={car._id + variant.name + url}
          style={{ border: car.selectedFavcarsUrl === url ? '3px solid yellow' : 'none' }}
          onClick={() => select(car._id, variant.name, url)}>
          <img src={url} style={{ maxHeight: '250px' }} alt={variant.name} />
        </button>)
      );

      return (
        <div key={car._id + variant.name}>
          <h4 style={{ textAlign: 'left' }}>{variant.name}</h4>
          <div style={{ display: 'flex' }}>{imagesToSelect}</div>
        </div>
      );

    });

    let manualAddImageForm = '';
    if (carVariants.length === 0) {
      manualAddImageForm = (
        <input type="text" placeholder="Add url" onChange={event => select(car._id, car.variant, event.target.value)} />
      );
    }

    const selectedImage = car.selectedFavcarsUrl ? <img src={car.selectedFavcarsUrl} style={{ maxHeight: '100px' }} alt={car.variant} /> : '';

    const unselectButton = car.selectedFavcarsUrl ? <button onClick={() => unselect(car._id, car.selectedFavcarsVariant)}>Unselect {car.selectedFavcarsVariant}</button> : '';

    const noMatchButton = !car.selectedFavcarsVariant ?
      <button onClick={() => nomatch(car._id)}>No match</button> : '';

    return (
      <div key={car._id}>
        <div style={{ display: 'flex' }}>
          <h3 style={{ textAlign: 'left', color: 'blue' }}>
            {noMatchButton} {car.variant} ({car.startYear})
          </h3>
          {selectedImage}
          {unselectButton}
          {manualAddImageForm}
        </div>
        {!car.selectedFavcarsUrl && <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>{carVariants}</div>}
      </div>
    );
  });

  return (
    <>
      {carElements}
    </>
  );

};

