import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { useNavigation } from "@react-navigation/core";
import { useFab } from "../../context/fabContext";


export default function Report() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();

  useFocusEffect(
    useCallback(() => {
      setAction(() => () => navigation.navigate('NewApplication'));

      return () => setAction(null);
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Text>Relatórios</Text>
    </View>
  );
};