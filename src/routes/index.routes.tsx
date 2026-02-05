import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/Login";
import BottomRoutes from "./bottom.routes";

export type RootStackParamList = {
  Login: undefined;
  BottomRoutes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator initialRouteName="Login"
    screenOptions={{ headerShown: false }}
    >

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="BottomRoutes"
        component={BottomRoutes}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}