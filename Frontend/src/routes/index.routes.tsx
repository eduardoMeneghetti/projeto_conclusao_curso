import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/Login";
import BottomRoutes from "./bottom.routes";
import Config from "../pages/Config";
import { ProprietyProvider } from "../context/PropContext";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../database/initializeDatabase";
import Proprieties from "../pages/proprieties";
import Harvest from "../pages/Harvest";
import Activity from "../pages/Activity";
import ActivityForm from "../pages/ActivityForm";
import User from "../pages/User";
import UserForm from "../pages/UserForm";
import { AuthProvider } from "../context/AuthContext";
import Gleba from "../pages/Gleba";
import PrincipioAtivo from "../pages/PrincipioAtivo";
import UnidadesMedida from "../pages/unidadesMedida";
import { PrincipioAtivoForm } from "../pages/PrincipioAtivoForm";
import { UnidadesMedidaForm } from "../pages/unidadesMedidaForm";
import StockItemForm from "../pages/StockItemForm";
import StockItemMov from "../pages/StockItemMov";
import StockItemMovItens from "../pages/StockItemMovItens";

export type RootStackParamList = {
  Login: undefined;
  BottomRoutes: undefined;
  Config: undefined;
  Proprieties: undefined;
  Harvest: undefined;
  Activity: undefined;
  ActivityForm: undefined;
  User: undefined;
  UserForm: { id?: string } | undefined;
  Gleba: undefined;
  PrincipioAtivo: undefined;
  PrincipioAtivoForm: undefined;
  UnidadesMedida: undefined;
  UnidadesMedidaForm: undefined;
  StockItemForm: undefined;
  StockItemMov: undefined;
  StockItemMovItens: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <AuthProvider>
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

            <Stack.Screen
              name="Harvest"
              component={Harvest}
            />

            <Stack.Screen
              name="Activity"
              component={Activity}
            />

            <Stack.Screen
              name="ActivityForm"
              component={ActivityForm}
            />

            <Stack.Screen
              name="User"
              component={User}
            />

            <Stack.Screen
              name="UserForm"
              component={UserForm}
            />

            <Stack.Screen
              name="Gleba"
              component={Gleba}
            />

            <Stack.Screen
              name="PrincipioAtivo"
              component={PrincipioAtivo}
            />

            <Stack.Screen
              name="PrincipioAtivoForm"
              component={PrincipioAtivoForm}
            />

            <Stack.Screen
              name="UnidadesMedida"
              component={UnidadesMedida}
            />

            <Stack.Screen
              name="UnidadesMedidaForm"
              component={UnidadesMedidaForm}
            />

            <Stack.Screen
              name="StockItemForm"
              component={StockItemForm}
            />

            <Stack.Screen
              name="StockItemMov"
              component={StockItemMov}
            />

            <Stack.Screen
              name="StockItemMovItens"
              component={StockItemMovItens}
            />

          </Stack.Navigator>
        </ProprietyProvider>
      </SQLiteProvider>
    </AuthProvider>
  );
}