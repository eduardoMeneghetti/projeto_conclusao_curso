import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/Login";
import BottomRoutes from "./bottom.routes";
import Config from "../pages/Config";
import { ProprietyProvider } from "../context/PropContext";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../database/initializeDatabase";
import Proprieties from "../pages/proprieties";

export type RootStackParamList = {
  Login: undefined;
  BottomRoutes: undefined;
  Config: undefined;
  Proprieties: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <SQLiteProvider databaseName="khronos.db" onInit={initializeDatabase}>
    <ProprietyProvider>
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

        <Stack.Screen
          name="Proprieties"
          component={Proprieties}
        />

      </Stack.Navigator>
    </ProprietyProvider>
    </SQLiteProvider>
  );
}