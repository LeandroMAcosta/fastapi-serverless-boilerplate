import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';

// Mock the auth hook
jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    signOut: jest.fn(),
  }),
}));

describe('App', () => {
  it('renders login form when not authenticated', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
  });
});
