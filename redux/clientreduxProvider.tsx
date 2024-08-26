'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { FC, ReactNode } from 'react';

interface ClientProviderProps {
  children: ReactNode;
}

const ClientreduxProvider : FC<ClientProviderProps>= ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default ClientreduxProvider;
