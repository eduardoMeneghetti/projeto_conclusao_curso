import React, { useEffect } from "react";
import {
  Text,
  View
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/native";

export default function Application() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();

  useEffect(() => {
    setAction(() => () => navigation.navigate('NewApplication'));

    return () => setAction(null);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Aplicacoes de insumos</Text>
    </View>
  );
}
