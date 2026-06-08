import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  Animated,
  TextInput,
  Button,
  TouchableOpacity,
  Alert
} from 'react-native';
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/core";
import { CardRelatorio } from "../../components/CardRelatorio";
import { usePropriety } from "../../context/PropContext";


export default function Report() {
  const navigation = useNavigation<any>();

  const { selectedPropriety } = usePropriety();

  function handleNavigateToStockReport() {
    if (!selectedPropriety) {
      Alert.alert('Atenção', 'O relatório de estoque requer uma propriedade selecionada. Por favor, selecione uma propriedade para acessar este relatório.');
      return;
    }

    navigation.navigate('StockReportFilters');
  }

  function handleNavigateToRecommendationsReport() {
    if (!selectedPropriety) {
      Alert.alert('Atenção', 'O relatório de recomendações requer uma propriedade selecionada. Por favor, selecione uma propriedade para acessar este relatório.');
      return;
    }

    navigation.navigate('RecommendationsReportFilters');
  }

  return (
    <View style={styles.container}>
      <CardRelatorio
        title="Extrato de Estoque"
        imageSource={require('../../assets/icon/extrato_de_estoque.png')}
        onPress={
          () => handleNavigateToStockReport()
        }
      />

      <CardRelatorio
        title="Recomendações por Safra"
        imageSource={require('../../assets/icon/recomendacao_active.png')}
        onPress={
          () => handleNavigateToRecommendationsReport()
        }
      />

      <CardRelatorio
        title="Histórico de Análises de Solo"
        imageSource={require('../../assets/icon/analise_solo.png')}
        onPress={
          () => navigation.navigate('SoilAnalysisReport')
        }
      />

      <CardRelatorio
        title="Consumo de Insumos por Gleba"
        imageSource={require('../../assets/icon/insumos.png')}
        onPress={
          () => navigation.navigate('InputConsumptionReport')
        }
      />

    </View>
  );
};