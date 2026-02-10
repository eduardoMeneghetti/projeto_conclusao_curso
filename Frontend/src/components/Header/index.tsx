// comando rfnc para criar um componente funcional com exportação padrão
import React, { use, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";
import { AuthSelectionContext, useAuthSelection } from "../../context/selectionContext";

export default function Header() {

  const { onOpen, selectedProperty  } = useContext<any>(AuthSelectionContext);

  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top + 10, // Respeita notch + padding adicional
        paddingBottom: 10,
      }
    ]}>
      <TouchableOpacity
        onPress={() => { }}
      >
        <Image
          source={require('../../assets/icon/menu-aberto.png')}
          style={styles.image}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpen}>
        <Text>
          {selectedProperty
            ? selectedProperty.title
            : 'Seleção de propriedade'}
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