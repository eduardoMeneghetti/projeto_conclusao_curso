import React, { useState, createContext, useContext, useEffect } from 'react';
import { usePropDatabase } from '../database/propDatabse';
import { PropDatabase } from '../database/propDatabse';

type ProprietyContextType = {
  isModalVisible: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedPropriety: PropDatabase | null;
  setSelectedPropriety: (propriety: PropDatabase) => void;
  proprieties: PropDatabase[];
  loadProprieties: (withInactive?: boolean) => void;  // 👈 adicionado
};

export const ProprietyContext = createContext<ProprietyContextType>(
  {} as ProprietyContextType
);

export const ProprietyProvider = ({ children }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPropriety, setSelectedPropriety] = useState<PropDatabase | null>(null);
  const [proprieties, setProprieties] = useState<PropDatabase[]>([]);
  const { getProprety, getPropretyAll } = usePropDatabase();

  const onOpen = () => setIsModalVisible(true);
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