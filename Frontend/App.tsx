import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import SplashScreenMy from './src/pages/SplashScreanMy';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Routes from './src/routes/index.routes';
import { NavigationContainer } from '@react-navigation/native';
import { FabProvider } from './src/context/fabContext';
import { SyncProvider } from './src/context/syncContext';


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (showSplash) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <SplashScreenMy onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <SyncProvider>
      <FabProvider>
        <NavigationContainer>
            <Routes />
        </NavigationContainer>
      </FabProvider>
    </SyncProvider>
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
