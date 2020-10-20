import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { errorToMessage } from '../functions/form';

import './Login.css';

export const Login = ({ onSubmit, errorMessage }) => {
  const { register, handleSubmit, errors } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="card-heading">Login</h2>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          ref={register({ required: true })}
        />
        <div className="error">{errorToMessage(errors.realWeight)}&nbsp;</div>
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          ref={register({ required: true })}
        />
        <div className="error">{errorToMessage(errors.realWeight)}&nbsp;</div>
      </div>

      <button type="submit" style={{ marginTop: '10px' }}>OK</button>
    </form>
  );
};

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

Login.defaultProps = {
  errorMessage: null,
};
