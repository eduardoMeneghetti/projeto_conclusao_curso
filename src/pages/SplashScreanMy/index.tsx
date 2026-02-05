import React, { useEffect, useRef } from "react";
import { Text, View, Image, Animated } from 'react-native';
import { styles } from "./styles";

type Props = {
  onFinish?: () => void;
};

export default function SplashScreenMy({ onFinish }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        onFinish?.();
      }, 1200);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.boxTop} />

      <View style={styles.boxMid}>
        <Animated.View
          style={[
            styles.boxImage,
            {
              opacity: fade,
              transform: [{ translateY }],
            },
          ]}
        >
          <Image
            source={require('../../assets/Logo.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />

          <Text style={styles.title}>KHRONOS</Text>
          <Text style={styles.subTitle}>Gestão no tempo certo</Text>
        </Animated.View>
      </View>

      <View style={styles.boxBottom} />
    </View>
  );
}
