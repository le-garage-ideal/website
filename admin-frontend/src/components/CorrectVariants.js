import React from 'react';
import { useForm } from "react-hook-form";
import './CorrectVariants.css';


export const CorrectVariants = ({ selectedModel, selectedCars, createVariant, removeVariant }) => {

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => createVariant(data);

  const carElements = selectedCars.map(car => {
    return car ? <div key={car._id} style={{ display: 'flex' }}>
      <button style={{ marginRight: '10px', backgroundColor: car.selectedFavcarsUrl ? 'lightgreen' : 'red' }} onClick={() => removeVariant(car._id)}><span role="img" aria-label="Remove">🗑️</span></button>
      <span style={{ marginRight: '10px' }}>{car.startYear}</span>
      <span>{car.variant}</span>
    </div> : '';
  });

  const errorToMessage = error => error ? error.type === 'required' ? 'Required' : error.type === 'pattern' ? 'Number' : 'Error' : '';

  return (
    <section className="correctVariantsContainer">
      <section>{carElements}</section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>New variant</h3><div></div>
        <input type="text" name="variant" placeholder="variant" ref={register({ required: true })}></input>
        <div className="error">{errorToMessage(errors.variant)}</div>
        <input type="text" name="power" placeholder="power" ref={register({ required: true })}></input>
        <div className="error">{errorToMessage(errors.power)}</div>
        <input type="text" name="realWeight" placeholder="real weight" ref={register({ pattern: /^\d+$/i })}></input>
        <div className="error">{errorToMessage(errors.realWeight)}</div>
        <input type="text" name="officialWeight" placeholder="official weight" ref={register({ pattern: /^\d+$/i, required: true })}></input>
        <div className="error">{errorToMessage(errors.officialWeight)}</div>
        <input type="text" name="options" placeholder="options" ref={register}></input>
        <div className="error">{errorToMessage(errors.options)}</div>
        <input type="text" name="selectedFavcarsUrl" placeholder="Image URL" ref={register({ required: true })}></input>
        <div className="error">{errorToMessage(errors.selectedFavcarsUrl)}</div>
        <input type="hidden" name="modelId" defaultValue={selectedModel._id} ref={register}></input>
        <button type="submit">Create</button>
      </form>
    </section>
  );

};

