import React, { createContext, useContext, useState } from 'react';

type FabContextType = {
  action: (() => void) | null;
  setAction: (fn: (() => void) | null) => void;
  requiresHarvest: boolean;       
  setRequiresHarvest: (value: boolean) => void;
  requiresPropriety: boolean;
  setRequiresPropriety: (value: boolean) => void;
};

const FabContext = createContext<FabContextType>({} as FabContextType);

export const FabProvider = ({ children }: any) => {
  const [action, setAction] = useState<(() => void) | null>(null);
  const [requiresHarvest, setRequiresHarvest] = useState(true);
  const [requiresPropriety, setRequiresPropriety] = useState(true);

  return (
    <FabContext.Provider value={{ action, setAction, requiresHarvest, setRequiresHarvest, requiresPropriety, setRequiresPropriety }}>
      {children}
    </FabContext.Provider>
  );
};

export const useFab = () => useContext(FabContext);
