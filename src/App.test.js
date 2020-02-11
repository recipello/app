import React from 'react';
import { render, act } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import App from './app';

test('renders learn react link', async () => {
    let result = null;
  await act(async () => {
      result = render(<Router><App token="123" /></Router>);
      const { getByText } = result;
      const linkElement = getByText(/add recipe/i);
      const nameElement = getByText(/this is recipe 1/i);
      const fakeUserResponse = [
          {
              name: "this is recipe 1"
          }
      ]
      jest.spyOn(window, 'fetch').mockImplementationOnce(() => {
        return Promise.resolve({
          json: () => Promise.resolve(fakeUserResponse),
        })
      })

      expect(linkElement).toBeInTheDocument();
      expect(nameElement).toBeInTheDocument();
  });

});
