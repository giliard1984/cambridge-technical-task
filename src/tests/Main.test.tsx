import React from 'react';
import { render, screen } from '@testing-library/react';
import Main from '../views/Main';

test('renders error find text', () => {
  render(<Main />);
  const linkElement = screen.getByText(/Error Find/i);
  expect(linkElement).toBeInTheDocument();
});
