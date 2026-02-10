import React from "react";
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


export default function Home() {
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