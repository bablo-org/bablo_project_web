import { createContext } from 'react';

export const AuthContext = createContext({
  isAuth: localStorage.getItem('isAuth'),
  user: null,
  setIsAuth: () => {},
  setUser: () => {},
});