import React, { use, useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/core";
import OptionsModal from "../../components/OptionsModal";


export default function Recomendacoes() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();

  const [optionsVisible, setOptionsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAction(() => () => setOptionsVisible(true));

      return () => {
        setAction(null);
        setOptionsVisible(false);
      };
    }, [])
  );

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
            onPress:() => navigation.navigate('')
          },
           {
            label: 'Recomendação manual',
            onPress:() => navigation.navigate('RecommendationManual')
          }
        ]} 
      />
    </View>
  );
};