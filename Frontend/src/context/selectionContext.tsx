import React, { useState, useEffect } from 'react';
import { useHarverstDatabase, UseHarverst } from '../database/useHarverstDatabase';

type AuthSelectionContextType = {
  onOpen: () => void;
  onClose: () => void;
  isVisible: boolean;          
  selectedHarvest: UseHarverst | null;
  harvests: UseHarverst[];      
  loadHarvests: (withInactive?: boolean) => void;  
  setSelectedHarvest: (harvest: UseHarverst | null) => void;
};

export const AuthSelectionContext =
  React.createContext<AuthSelectionContextType>(
    {} as AuthSelectionContextType
  );

export const AuthProviderContext = (props: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<UseHarverst | null>(null);
  const [harvests, setHarvests] = useState<UseHarverst[]>([]);
  const { getHarvest, getHarvestAll } = useHarverstDatabase();

  const onOpen = () => {
    setIsVisible(true);
    loadHarvests(); 
  };
  const onClose = () => setIsVisible(false);

  const loadHarvests = (withInactive: boolean = false) => {
    const fetch = withInactive ? getHarvestAll : getHarvest;
    fetch()?.then((result) => {
      if (result) setHarvests(result);
    });
  };

  useEffect(() => {
    loadHarvests();
  }, []);

  return (
    <AuthSelectionContext.Provider
      value={{
        onOpen,
        onClose,
        isVisible,
        selectedHarvest,
        harvests,
        loadHarvests,
        setSelectedHarvest
      }}
    >
      {props.children}
    </AuthSelectionContext.Provider>
  );
};

export const useAuthSelection = () => React.useContext(AuthSelectionContext);