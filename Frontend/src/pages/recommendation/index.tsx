import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Alert,
  Text,
  View
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/core";
import OptionsModal from "../../components/OptionsModal";
import { useAuth } from "../../context/AuthContext";
import { CardRecomendation } from "../../components/CardRecomendation";
import { ScrollView } from "react-native-gesture-handler";
import { usePropriety } from "../../context/PropContext";
import { useRecommendationDatabase } from "../../database/useRecommendationDatabase";

export default function Recomendacoes() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();
  const { selectedPropriety } = usePropriety();
  const { user } = useAuth();

  const { getRecommendationAll, updateStatusRecomendation } = useRecommendationDatabase();

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [recomendacoes, setRecomendacoes] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setAction(() => () => setOptionsVisible(true));

      return () => {
        setAction(null);
        setOptionsVisible(false);
      };
    }, [user])
  );

  useFocusEffect(
    useCallback(() => {
      if (!selectedPropriety) {
        setRecomendacoes([]);
        return;
      }
      updateStatusRecomendation().then(() =>
        getRecommendationAll(selectedPropriety.id).then(setRecomendacoes)
      );
    }, [selectedPropriety])
  )

  function handleNavigateToRecommendationManual() {
    if (!user?.recomendante) {
      Alert.alert("Acesso negado", "Usuário logado não é recomendante.");
      return;
    }
    navigation.navigate('RecommendationManual');
  }

  return (
    <View style={styles.container}>

      <View style={styles.scroll}>
        <ScrollView>
          {selectedPropriety && recomendacoes.length > 0 ? (
            recomendacoes.map((rec) => (
              <CardRecomendation
                key={rec.id_recomendacao}
                id_recomendacao={rec.id_recomendacao}
                area_aplic={rec.area_aplic}
                data_inicio={rec.data_inicio}
                data_fim={rec.data_fim}
                gleba={rec.gleba}
                operador={rec.operador}
                recomendante={rec.recomendante}
                origem={rec.origem}
                status={rec.status}
                safra={rec.safra}
                itens={rec.itens}
                onPress={
                  () => {
                     navigation.navigate('RecommendationManual', { id: rec.id_recomendacao });
                  }
                }
              />
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <Text style={{ color: 'rgba(0,0,0,0.4)' }}>{!selectedPropriety ? 'Selecione uma propriedade nas configurações' : 'Nenhuma movimentação encontrada'}</Text>
            </View>
          )}
        </ScrollView>
      </View>


      <OptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        title="Tipo de recomendação"
        options={[
          {
            label: 'Analise de solo',
            onPress: () => navigation.navigate('AnaliseSolos')
          },
          {
            label: 'Recomendação manual',
            onPress: handleNavigateToRecommendationManual
          }
        ]}
      />
    </View>
  );
};
