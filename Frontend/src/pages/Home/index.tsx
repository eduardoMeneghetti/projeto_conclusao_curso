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
import MapView from "react-native-maps";
import { useNavigation } from "@react-navigation/core";
import { useFab } from "../../context/fabContext";


export default function Home() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();

  useEffect(() => {
    setAction(() => () => navigation.navigate('NewApplication'));

    return () => setAction(null);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType="hybrid"
        initialRegion={{
          latitude: -27.6305,      // Brasil - Erechim
          longitude: -52.2364,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      />
    </View>
  );
};