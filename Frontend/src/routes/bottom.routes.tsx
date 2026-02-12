import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Application from '../pages/Application';
import Recomendacoes from '../pages/recommendation';
import Report from '../pages/report';
import Stock from '../pages/Stock';
import Home from '../pages/Home';
import CustomTabBar from '../components/ButtonBar';
import Header from '../components/Header';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { AuthProviderContext } from '../context/selectionContext';
import { FabProvider } from '../context/fabContext';
import { GlobalButton } from '../components/GlobalButton';

const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Application: undefined;
  Recomendacoes: undefined;
  Home: undefined;
  Relatorios: undefined;
  Estoque: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function BottomRoutes() {
  return (
    <FabProvider>
      <AuthProviderContext>
        <View style={{ flex: 1 }}>
          <Header />
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false
            }}
            tabBar={props => <CustomTabBar {...props} />}
          >


            <Tab.Screen
              name="Aplicacoes"
              component={Application}
            />

            <Tab.Screen
              name="Recomendacoes"
              component={Recomendacoes}
            />

            <Tab.Screen
              name="Home"
              component={Home}
            />

            <Tab.Screen
              name="Relatorios"
              component={Report}
            />


            <Tab.Screen
              name="Estoque"
              component={Stock}
            />

          </Tab.Navigator>

          <GlobalButton />

        </View>
      </AuthProviderContext>
    </FabProvider>
  );
}