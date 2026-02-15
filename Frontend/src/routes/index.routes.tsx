import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/Login";
import BottomRoutes from "./bottom.routes";
import Config from "../pages/Config";

export type RootStackParamList = {
  Login: undefined;
  BottomRoutes: undefined;
  Config: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
      />

      <Stack.Screen 
        name="BottomRoutes"
        component={BottomRoutes}
      />

      <Stack.Screen
        name="Config"
        component={Config}
      />
    </Stack.Navigator>
  );
}