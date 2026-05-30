'use client';
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext<any>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(null);
  return (
    <ThemeContext.Provider value={{ state, setState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
