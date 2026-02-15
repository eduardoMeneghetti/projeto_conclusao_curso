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

type NavigationProps = StackNavigationProp<RootStackParamList, 'Config'>;

export default function Header() {
  const navigation = useNavigation<NavigationProps>();
  const { onOpen, selectedHarvest } = useAuthSelection();

  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top + 10,
        paddingBottom: 10,
      }
    ]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Config')}
      >
        <Image
          source={require('../../assets/icon/menu-aberto.png')}
          style={styles.image}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpen}>
        <Text>
          {selectedHarvest
            ? selectedHarvest.title
            : 'Seleção da safra'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => { }}
      >
        <Image
          source={require('../../assets/icon/aprovar_audit.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
}