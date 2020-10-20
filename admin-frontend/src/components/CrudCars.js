import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { errorToMessage } from '../functions/form';
import './CrudCars.css';


export const CrudCars = ({ selectedModel, selectedCars, createCar, removeCar }) => {

  const [formDisplayed, setFormDisplayed] = useState(false);

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => createCar({ ...data, model: { ...selectedModel } });

  const carElements = selectedCars.filter(car => !!car).map(car => (
    <div key={'car-crud-item-' + car._id} id={'car-crud-item-' + car._id} className="crudCarsItem">
      <button className={car.selectedFavcarsUrl ? 'complete' : ''}
        onClick={() => removeCar(car._id)}>
        <span role="img" aria-label="Remove">🗑️</span>
      </button>
      <span style={{ marginRight: '10px' }}>{car.startYear}</span>
      <span>{car.variant}</span>
      <span role="img" aria-label="Has image" title="Has image" className="has-image">🖼</span>
    </div>
  ));

  const fieldsContainerClassNames = ['fieldsContainer'];
  if (formDisplayed) {
    fieldsContainerClassNames.push('fieldsContainerDisplayed');
  } else {
    fieldsContainerClassNames.push('fieldsContainerHidden');
  }

  return (
    <section className="crudCarsContainer">
      <button
        type="button"
        className="addButton"
        onClick={() => setFormDisplayed(!formDisplayed)}
      >
        {formDisplayed ? '➖' : '➕'}
      </button>
      <div className="elementsFormContainer">
        <section>{carElements}</section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={fieldsContainerClassNames.join(' ')}>
            <input type="text" name="variant" placeholder="Variant" ref={register({ required: true })}></input>
            <div className="error">{errorToMessage(errors.variant)}&nbsp;</div>
            <input type="text" name="startYear" placeholder="Start year" ref={register({ pattern: /^\d{4}$/i, required: true })}></input>
            <div className="error">{errorToMessage(errors.startYear)}&nbsp;</div>
            <input type="text" name="endYear" placeholder="End year" ref={register({ pattern: /^\d{4}$/i })}></input>
            <div className="error">{errorToMessage(errors.endYear)}&nbsp;</div>
            <input type="text" name="power" placeholder="Power" ref={register({ required: true })}></input>
            <div className="error">{errorToMessage(errors.power)}&nbsp;</div>
            <input type="text" name="realWeight" placeholder="Real weight" ref={register({ pattern: /^\d+$/i })}></input>
            <div className="error">{errorToMessage(errors.realWeight)}&nbsp;</div>
            <input type="text" name="officialWeight" placeholder="Official weight" ref={register({ pattern: /^\d+$/i, required: true })}></input>
            <div className="error">{errorToMessage(errors.officialWeight)}&nbsp;</div>
            <input type="text" name="options" placeholder="Options" ref={register}></input>
            <div className="error">{errorToMessage(errors.options)}&nbsp;</div>
            <input type="text" name="selectedFavcarsUrl" placeholder="Image URL" ref={register({ required: true })}></input>
            <div className="error">{errorToMessage(errors.selectedFavcarsUrl)}&nbsp;</div>
            <button type="submit" className="submitButton">Create</button>
          </div>
        </form>
      </div>
    </section>
  );

};

