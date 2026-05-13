import React, { useState, useEffect } from 'react';
import { useHarverstDatabase, UseHarverst } from '../database/useHarverstDatabase';
import { usePropriety } from './PropContext';
import { Alert } from 'react-native';
import { UseActivityHarvestDatabase } from '../database/useActivityHarvestDatabase';

type AuthSelectionContextType = {
  onOpen: () => void;
  onClose: () => void;
  isVisible: boolean;
  selectedHarvest: UseHarverst | null;
  harvests: UseHarverst[];
  loadHarvests: (withInactive?: boolean) => void;
  setSelectedHarvest: (harvest: UseHarverst | null) => void;
  selectedAtividadeSafraId: number | null;
  setSelectedAtividadeSafraId: (id: number | null) => void;
};

export const AuthSelectionContext =
  React.createContext<AuthSelectionContextType>(
    {} as AuthSelectionContextType
  );

export const AuthProviderContext = (props: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<UseHarverst | null>(null);
  const [selectedAtividadeSafraId, setSelectedAtividadeSafraId] = useState<number | null>(null);
  const { getActivityHarvestById } = UseActivityHarvestDatabase();
  const [harvests, setHarvests] = useState<UseHarverst[]>([]);
  const { getHarvest, getHarvestAll } = useHarverstDatabase();
  const { selectedPropriety } = usePropriety();

  const onOpen = () => {

    if (!selectedPropriety) {
      Alert.alert(
        "Anteção",
        "Selecione uma propriedade antes de continuar"
      );
      return
    }

    setIsVisible(true);
    loadHarvests();
  };
  const onClose = () => setIsVisible(false);

  const handleSelectHarvest = (harvest: UseHarverst | null) => {
    setSelectedHarvest(harvest);

    if (!harvest) {
      setSelectedAtividadeSafraId(null);
      return;
    }

    getActivityHarvestById(harvest.id).then((atividadeSafra) => {
      if (atividadeSafra) {
        console.log('AtividadeSafra selecionada ID:', atividadeSafra.id);
        setSelectedAtividadeSafraId(atividadeSafra.id);
      } else {
        console.log('Nenhuma AtividadeSafra encontrada para harvest:', harvest.id);
        setSelectedAtividadeSafraId(null);
      }
    });
  };

  const loadHarvests = (withInactive: boolean = false) => {
    if (!selectedPropriety) return;

    const fetch = withInactive ? getHarvestAll : getHarvest;
    fetch(selectedPropriety.id).then((result) => {
      if (result) setHarvests(result);
    });
  };

  useEffect(() => {
    loadHarvests();
  }, [selectedPropriety]);

  return (
    <AuthSelectionContext.Provider
      value={{
        onOpen,
        onClose,
        isVisible,
        selectedHarvest,
        harvests,
        loadHarvests,
        setSelectedHarvest: handleSelectHarvest,
        selectedAtividadeSafraId,
        setSelectedAtividadeSafraId,
      }}
    >
      {props.children}
    </AuthSelectionContext.Provider>
  );
};

export const useAuthSelection = () => React.useContext(AuthSelectionContext);