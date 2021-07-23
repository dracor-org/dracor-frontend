import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';

test('renders DraCor heading', () => {
  render(<App />);
  const heading = screen.getByText(/DraCor/i);
  expect(heading).toBeInTheDocument();
});
