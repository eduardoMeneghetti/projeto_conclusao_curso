import React, { createContext, useContext, useState } from 'react';

type FabContextType = {
  action: (() => void) | null;
  setAction: (fn: (() => void) | null) => void;
};

const FabContext = createContext<FabContextType>({} as FabContextType);

export const FabProvider = ({ children }: any) => {
  const [action, setAction] = useState<(() => void) | null>(null);

  return (
    <FabContext.Provider value={{ action, setAction }}>
      {children}
    </FabContext.Provider>
  );
};

export const useFab = () => useContext(FabContext);
