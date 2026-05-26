import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/native";
import { usePropriety } from "../../context/PropContext";
import { useAuth } from "../../context/AuthContext";
import OptionsModal from "../../components/OptionsModal";

export default function Application() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();
  const { selectedPropriety } = usePropriety();
  const { user } = useAuth();

  const [optionsVisible, setOptionsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAction(() => () => setOptionsVisible(true));

      return () => setAction(null);
    }, [navigation])
  );

  return (
    <View style={styles.container}>

      <OptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        title={"Aplicações"}
        options={[
          {
            label: 'Aplicar recomendação',
            onPress: () => navigation.navigate('')
          },
          {
            label: 'Nova aplicação',
            onPress: () => navigation.navigate('')
          }
        ]}
      />
    </View>
  );
}
