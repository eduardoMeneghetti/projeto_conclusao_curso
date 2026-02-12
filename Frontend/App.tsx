import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import SplashScreenMy from './src/pages/SplashScreanMy';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Routes from './src/routes/index.routes';
import { NavigationContainer } from '@react-navigation/native';
import { FabProvider } from './src/context/fabContext';


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [nativeReady, setNativeReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);


  // splash NATIVA
  useEffect(() => {
    setNativeReady(true);
  }, []);

  useEffect(() => {
    if (nativeReady) {
      SplashScreen.hideAsync();
    }
  }, [nativeReady]);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <SplashScreenMy onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <FabProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </FabProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
