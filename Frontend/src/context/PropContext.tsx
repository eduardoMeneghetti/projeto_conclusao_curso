import React, { useState, createContext, useContext, useEffect } from 'react';
import { usePropDatabase } from '../database/usePropDatabase';
import { PropDatabase } from '../database/usePropDatabase';

type ProprietyContextType = {
  isModalVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedPropriety: PropDatabase | null;
  setSelectedPropriety: (propriety: PropDatabase) => void;
  proprieties: PropDatabase[];
  loadProprieties: (withInactive?: boolean) => void;  
};

export const ProprietyContext = createContext<ProprietyContextType>(
  {} as ProprietyContextType
);

export const ProprietyProvider = ({ children }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPropriety, setSelectedPropriety] = useState<PropDatabase | null>(null);
  const [proprieties, setProprieties] = useState<PropDatabase[]>([]);
  const { getProprety, getPropretyAll } = usePropDatabase();

  const onOpen = () => {
    setIsModalVisible(true);
    loadProprieties();
  }
  
  const onClose = () => setIsModalVisible(false);

  const loadProprieties = (withInactive: boolean = false) => {
    const fetch = withInactive ? getPropretyAll : getProprety;
    fetch().then((result) => {
      if (result) setProprieties(result);
    });
  };

  useEffect(() => {
    loadProprieties();
  }, []);

  return (
    <ProprietyContext.Provider
      value={{
        isModalVisible,
        onOpen,
        onClose,  
        selectedPropriety,
        setSelectedPropriety,
        proprieties,
        loadProprieties
      }}
    >
      {children}
    </ProprietyContext.Provider>
  );
};

export const usePropriety = () => useContext(ProprietyContext);