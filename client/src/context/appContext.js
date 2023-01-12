import React, { useState, useReducer, useContext } from 'react';

import reducer from './reducer';
import { CLEAR_ALERT, DISPLAY_ALERT } from './actions';

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
};

const AppContext = React.createContext();

// providing the value for all the children by using AppContext
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // clear the alert after 3s
  const clearAlert = () => {
    setTimeout(() => {
      // always pass in the object for dispatch
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const displayAlert = () => {
    // always pass in the object for dispatch
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  return (
    // All the children (App) will able to use VAlUE passed through
    <AppContext.Provider value={{ ...state, displayAlert }}>
      {children}
    </AppContext.Provider>
  );
};

// custom hooks by using 'use'
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
