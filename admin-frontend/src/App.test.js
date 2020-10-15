import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
jest.mock('./functions/api', () => ({
  fetchInitData: jest.fn(() => Promise.resolve({ cars: [], models: [], brands: [], brandMap: {}, modelMap: {} }))
}))

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Admin Site/i);
  expect(linkElement).toBeInTheDocument();
});
