// ClickCountContext.js
import React, { createContext, useState, useContext } from 'react';

// Create Context
const ClickCountContext = createContext();

// Provider Component
export const ClickCountProvider = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);

  const incrementClickCount = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  const resetClickCount = () => {
    setClickCount(0);
  };

  return (
    <ClickCountContext.Provider value={{ clickCount, incrementClickCount, resetClickCount }}>
      {children}
    </ClickCountContext.Provider>
  );
};

// Custom hook to use click count
export const useClickCount = () => useContext(ClickCountContext);
