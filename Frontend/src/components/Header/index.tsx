import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import { useAuthSelection } from "../../context/selectionContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../routes/index.routes";
import { usePropriety } from "../../context/PropContext";
import SelectionModal from "../../components/SelectionModal";


type NavigationProps = StackNavigationProp<RootStackParamList,
  'Config',
  'Harvest'
>;

export default function Header() {
  const navigation = useNavigation<any>();
  const { onOpen, onClose, isVisible, selectedHarvest, harvests, loadHarvests, setSelectedHarvest } = useAuthSelection();
  const { selectedPropriety } = usePropriety();

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: 10 }]}>

      <TouchableOpacity onPress={() => navigation.navigate('Config')}>
        <Image source={require('../../assets/icon/menu-aberto.png')} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.context}>
        <TouchableOpacity onPress={onOpen}>
          <Text style={styles.tilteHarvest}>
            {selectedHarvest ? selectedHarvest.descricao : 'Seleção da safra'}
          </Text>
        </TouchableOpacity>
        <Text>
          {selectedPropriety ? selectedPropriety.descricao : ''}
        </Text>
      </View>

      <TouchableOpacity onPress={() => { }}>
        <Image source={require('../../assets/icon/sincronizar.png')} style={styles.image} />
      </TouchableOpacity>

      <SelectionModal
        isVisible={isVisible}
        onClose={onClose}
        title="Selecione a Safra"
        data={harvests.map(h => ({
          id: String(h.id),
          title: h.descricao,
          inactive: !h.ativo
        }))}
        selectedId={selectedHarvest ? String(selectedHarvest.id) : null}
        onSelect={(item) => {
          const harvest = harvests.find(h => String(h.id) === item.id);
          if (harvest) setSelectedHarvest(harvest);
        }}
        showInactiveToggle={true}
        onToggleInactive={(show) => loadHarvests(show)}
        onAdd={() => {
          onClose();
          navigation.navigate('Harvest' as never);
        }}
        onEdit={(item) => {
          onClose();
          navigation.navigate('Harvest', {id: item.id})
        }}
      />

    </View>
  );
}