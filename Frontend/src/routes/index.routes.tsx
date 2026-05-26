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
import { AuthProviderContext } from "../context/selectionContext";
import Gleba from "../pages/Gleba";
import PrincipioAtivo from "../pages/PrincipioAtivo";
import UnidadesMedida from "../pages/unidadesMedida";
import { PrincipioAtivoForm } from "../pages/PrincipioAtivoForm";
import { UnidadesMedidaForm } from "../pages/unidadesMedidaForm";
import StockItemForm from "../pages/StockItemForm";
import StockItemMov from "../pages/StockItemMov";
import StockItemMovItens from "../pages/StockItemMovItens";
import RecommendationManual from "../pages/RecommendationManual";
import RecommendationManualGleba from "../pages/recommendationManualGleba";
import recomendationManualInsumo from "../pages/recomendationManualInsumo";
import AnaliseSolos from "../pages/AnaliseSolos";
import AnaliseNPK from "../pages/AnaliseNPK";
import AnaliseSolosFichamento from "../pages/AnaliseSolosFichamento";
import AnalisesSoloResultados from "../pages/AnalisesSoloResultados";
import Maquinas from "../pages/Maquinas";
import MaquinasForm from "../pages/MaquinasForm";

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
  RecommendationManual: undefined;
  RecommendationManualGleba: undefined;
  recomendationManualInsumo: undefined;
  AnaliseSolos: undefined;
  AnaliseSolosFichamento: undefined;
  AnaliseNPK: undefined;
  AnalisesSoloResultados: undefined
  Maquinas: undefined;
  MaquinasForm: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <AuthProvider>
      <SQLiteProvider databaseName="khronos.db" onInit={initializeDatabase}>
        <ProprietyProvider>
          <AuthProviderContext>
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

              <Stack.Screen
                name="RecommendationManual"
                component={RecommendationManual}
              />

              <Stack.Screen
                name="RecommendationManualGleba"
                component={RecommendationManualGleba}
              />

              <Stack.Screen
                name="recomendationManualInsumo"
                component={recomendationManualInsumo}
              />

              <Stack.Screen
                name="AnaliseSolos"
                component={AnaliseSolos}
              />


              <Stack.Screen
                name="AnaliseSolosFichamento"
                component={AnaliseSolosFichamento}
              />

              <Stack.Screen
                name="AnaliseNPK"
                component={AnaliseNPK}
              />

              <Stack.Screen
                name="AnalisesSoloResultados"
                component={AnalisesSoloResultados}
              />

              <Stack.Screen
                name="Maquinas"
                component={Maquinas}
              />

              <Stack.Screen
                name="MaquinasForm"
                component={MaquinasForm}
              />

            </Stack.Navigator>
          </AuthProviderContext>
        </ProprietyProvider>
      </SQLiteProvider>
    </AuthProvider>
  );
}