import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  Text,
  View
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/core";
import OptionsModal from "../../components/OptionsModal";
import { useAuth } from "../../context/AuthContext";


export default function Recomendacoes() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [optionsVisible, setOptionsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAction(() => () => setOptionsVisible(true));

      return () => {
        setAction(null);
        setOptionsVisible(false);
      };
    }, [user])
  );

  function handleNavigateToRecommendationManual() {
    if (!user?.recomendante) {
      Alert.alert("Acesso negado", "Usuário logado não é recomendante.");
      return;
    }
    navigation.navigate('RecommendationManual');
  }

  return (
    <View style={styles.container}>
      <Text>recomendation</Text>

      <OptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        title="Tipo de recomendação"
        options={[
          {
            label: 'Analise de solo',
            onPress: () => navigation.navigate('')
          },
          {
            label: 'Recomendação manual',
            onPress: handleNavigateToRecommendationManual
          }
        ]}
      />
    </View>
  );
};
