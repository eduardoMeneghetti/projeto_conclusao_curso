import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ScrollView,
  Text,
  View
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/native";
import { usePropriety } from "../../context/PropContext";
import { useAuth } from "../../context/AuthContext";
import OptionsModal from "../../components/OptionsModal";
import { CardApplication } from "../../components/CardApplication";
import { UseAplicacoesDatabase } from "../../database/useAplicacoesDatabase";
import { RecommendationImportModal } from "../../components/RecommendationImportModal";
import { RecomendacaoImportItem } from "../../database/useRecommendationDatabase";
import { useRecommendationItensDatabase } from "../../database/useRecommendationItensDatabase";

export default function Application() {
  const { setAction } = useFab();
  const navigation = useNavigation<any>();
  const { selectedPropriety } = usePropriety();
  const { user } = useAuth();

  const { getAplicacoesAll } = UseAplicacoesDatabase();
  const { getItemsByRecommendationId } = useRecommendationItensDatabase();

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [modalRecVisible, setModalRecVisible] = useState(false);
  const [aplicacoes, setAplicacoes] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      setAction(() => () => setOptionsVisible(true));
      return () => setAction(null);
    }, [navigation])
  );

  useFocusEffect(
    useCallback(() => {
      if (!selectedPropriety) {
        setAplicacoes([]);
        return;
      }
      getAplicacoesAll(selectedPropriety.id).then(setAplicacoes);
    }, [selectedPropriety])
  );

  async function handleImportarRecomendacao(rec: RecomendacaoImportItem) {
    setModalRecVisible(false);
    const itens = await getItemsByRecommendationId(rec.id);

    navigation.navigate('ApplicationNew', {
      recomendacoes_agricolas_id: rec.id,
      atividadeSafraId: rec.atividade_safra_id,
      proprietyId: selectedPropriety?.id,
      data_inicio: rec.data_inicio,
      data_fim: rec.data_fim,
      atividade_gleba_id: rec.atividade_gleba_id,
      area_aplic: rec.area_aplic,
      operador_id: rec.operador_id,
      initialItens: itens,
    });
  }

  return (
    <View style={styles.container}>

      <View style={styles.scroll}>
        <ScrollView>
          {selectedPropriety && aplicacoes.length > 0 ? (
            aplicacoes.map((aplic) => (
              <CardApplication
                key={aplic.id_aplicacao}
                id_aplicacao={aplic.id_aplicacao}
                area_aplic={aplic.area_aplic}
                data_inicio={aplic.data_inicio}
                data_final={aplic.data_final}
                gleba={aplic.gleba}
                operador={aplic.operador}
                safra={aplic.safra}
                recomendacoes_agricolas_id={aplic.recomendacoes_agricolas_id}
                itens={aplic.itens}
                onPress={() => navigation.navigate('ApplicationNew', { id: aplic.id_aplicacao })}
              />
            ))
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <Text style={{ color: 'rgba(0,0,0,0.4)' }}>
                {!selectedPropriety ? 'Selecione uma propriedade nas configurações' : 'Nenhuma aplicação encontrada'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <OptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        title="Aplicações"
        options={[
          {
            label: 'Aplicar recomendação',
            onPress: () => {
              setOptionsVisible(false);
              setModalRecVisible(true);
            }
          },
          {
            label: 'Nova aplicação',
            onPress: () => navigation.navigate('ApplicationNew')
          }
        ]}
      />

      {selectedPropriety && (
        <RecommendationImportModal
          isVisible={modalRecVisible}
          onClose={() => setModalRecVisible(false)}
          propriedadeId={selectedPropriety.id}
          onSelect={handleImportarRecomendacao}
        />
      )}
    </View>
  );
}