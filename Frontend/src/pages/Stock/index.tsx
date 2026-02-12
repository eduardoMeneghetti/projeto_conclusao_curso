import React, { useEffect } from "react";
import {
  Text,
  View,
  Image,
  Animated,
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/core";


export default function Stock() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();

  useEffect(() => {
    setAction(() => () => navigation.navigate('NewApplication'));

    return () => setAction(null);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>Controle de estoque</Text>
    </View>
  );
};