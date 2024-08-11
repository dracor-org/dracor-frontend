import {render, screen} from '@testing-library/react';
import App from './App';

test('renders DraCor GitHub link', () => {
  render(<App />);
  const link = screen.getByText(/DraCor GitHub/);
  expect(link).toBeInTheDocument();
});
