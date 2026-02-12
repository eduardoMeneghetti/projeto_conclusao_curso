import React, { useState } from 'react';
import { View, Dimensions, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { styles } from './sytles';
import { stylesContainer } from './stylesContainer';


type Harvest = {
  id: string;
  title: string;
};

type AuthSelectionContextType = {
  onOpen: () => void;
  onClose: () => void;
  selectedHarvest: Harvest | null;
};


export const AuthSelectionContext =
  React.createContext<AuthSelectionContextType>(
    {} as AuthSelectionContextType
  );


export const AuthProviderContext = (props: any): any => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);

  const insets = useSafeAreaInsets();

  const onOpen = () => setIsVisible(true);
  const onClose = () => setIsVisible(false);


  const data = [
    {
      id: '1',
      title: 'Fazenda Teste 1',
      done: false
    },
    {
      id: '2',
      title: 'Fazenda Teste 2',
      done: false
    },
    {
      id: '3',
      title: 'Fazenda Teste 3',
      done: false
    },
  ]

  const renderItem = ({ item }: { item: Harvest }) => {
    const isSelected = item.id === selectedHarvest?.id;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedHarvest(item);
          onClose();
        }}
        style={[
          stylesContainer.item,
          isSelected && stylesContainer.itemSelected
        ]}
      >
        <Text
          style={[
            stylesContainer.itemText,
            isSelected && stylesContainer.itemTextSelected
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };


  const _container = () => {
    return (
      <View style={stylesContainer.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };


  return (
      <AuthSelectionContext.Provider
      value={{
        onOpen,
        onClose,
        selectedHarvest,
      }}
    >
      {props.children}

      <Modal
        isVisible={isVisible}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        onBackdropPress={onClose}
        style={{ margin: 0, justifyContent: 'flex-start' }}
        propagateSwipe
      >
        <View style={styles.container}>
          {_container()}
        </View>
      </Modal>
    </AuthSelectionContext.Provider>
  );
};

export const useAuthSelection = () => React.useContext(AuthSelectionContext);