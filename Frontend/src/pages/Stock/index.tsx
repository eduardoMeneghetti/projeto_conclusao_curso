import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";
import RenderItem from "../../components/RenderItem";
import OptionsModal from "../../components/OptionsModal";
import { usePropriety } from "../../context/PropContext";
import { useInsumoDatabase, UseInsumoListItem } from "../../database/useInsumoDatabase";
import { useAjusteEstoqueDatabase } from "../../database/useAjusteEstoqueDatabase";
import { MovimentacaoCard } from "../../components/movimentacaoCard";



export default function Stock() {
  const { setAction, setRequiresHarvest } = useFab();
  const navigation = useNavigation<any>();
  const { selectedPropriety } = usePropriety();
  const { getInsumoAll } = useInsumoDatabase();
  const { getMovAll } = useAjusteEstoqueDatabase();

  const [insumo, setInsumo] = useState<UseInsumoListItem[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'estoque' | 'movimentacoes'>('estoque');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [optionsMovVisible, setOptionsMovVisible] = useState(false);
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);

  useEffect(() => {
    setRequiresHarvest(false);
    setAction(() => () => setOptionsVisible(true));

    return () => {
      setRequiresHarvest(true);
      setAction(null);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!selectedPropriety) {
        setMovimentacoes([]);
        return;
      }
      getMovAll(selectedPropriety.id).then(setMovimentacoes);
    }, [selectedPropriety])
  );

  useFocusEffect(
    useCallback(() => {
      if (!selectedPropriety) {
        setInsumo([]);
        return;
      }

      const loadInsumos = async () => {
        const data = await getInsumoAll(selectedPropriety?.id);
        if (data) setInsumo(data);
      };
      loadInsumos();
    }, [selectedPropriety])
  );

  return (
    <View style={styles.container}>

      <View style={styles.escolha}>
        <TouchableOpacity
          style={[
            styles.item1,
            abaAtiva === 'estoque' && styles.abaAtiva
          ]}
          onPress={() => setAbaAtiva('estoque')}
        >
          <Text style={[
            styles.text,
            abaAtiva === 'estoque' && styles.textAbaAtiva
          ]}>
            Estoque
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.item2,
            abaAtiva === 'movimentacoes' && styles.abaAtiva
          ]}
          onPress={() => setAbaAtiva('movimentacoes')}
        >
          <Text style={[
            styles.text,
            abaAtiva === 'movimentacoes' && styles.textAbaAtiva
          ]}>
            Movimentações
          </Text>

        </TouchableOpacity>
      </View>

      <View style={styles.scroll}>
        {abaAtiva === 'estoque' ? (
          <RenderItem
            data={insumo.map(i => ({
              id: String(i.id),
              saldo: i.saldo,
              title: i.descricao,
              subTitle: i.principio_ativo_descricao,
              unidade: i.unidade_sigla,
              inactive: !i.ativo
            }))}
            emptyMessage="Selecione uma propriedade nas configurações para ver os insumos"
            onEdit={
              (item) => { navigation.navigate('StockItemForm', { id: item.id }) }
            }
          />
        ) : (
          <ScrollView>
            {selectedPropriety && movimentacoes.length > 0 ? (
              movimentacoes.map((mov) => (
                <MovimentacaoCard
                  key={mov.ajuste_id}
                  entrada_saida={mov.entrada_saida}
                  data={mov.data}
                  observacao={mov.observacao}
                  itens={mov.itens}
                  onPress={() => navigation.navigate('StockItemMov', { id: mov.ajuste_id })}
                />
              ))
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                <Text>{!selectedPropriety ? 'Selecione uma propriedade nas configurações' : 'Nenhuma movimentação encontrada'}</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <OptionsModal
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        title="Estoque"
        options={[
          {
            label: 'Cadastrar insumo',
            onPress: () => navigation.navigate('StockItemForm')
          },
          {
            label: 'Movimentação de estoque',
            onPress: () => navigation.navigate('StockItemMov')
          }
        ]}
      />
    </View>
  );
};