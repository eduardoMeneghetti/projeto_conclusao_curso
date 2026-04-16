import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Animated,
  TextInput,
  Button,
  TouchableOpacity,
  Modal
} from 'react-native';
import { styles } from "./styles";
import { useFab } from "../../context/fabContext";
import { useNavigation } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";
import RenderItem from "../../components/RenderItem";
import OptionsModal from "../../components/OptionsModal";
import { usePropriety } from "../../context/PropContext";
import { useInsumoDatabase, UseInsumoListItem } from "../../database/useInsumoDatabase";



export default function Stock() {
  const { setAction, setRequiresHarvest } = useFab();
  const navigation = useNavigation<any>();
  const { selectedPropriety } = usePropriety();
  const { getInsumoAll } = useInsumoDatabase();

  const [insumo, setInsumo] = useState<UseInsumoListItem[]>([]);

  const [optionsVisible, setOptionsVisible] = useState(false);

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
      const loadInsumos = async () => {
        const data = await getInsumoAll();
        if (data) setInsumo(data);
      };
      loadInsumos();
    }, [getInsumoAll])
  ); 

  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <RenderItem
          data={insumo.map(i => ({
            id: String(i.id),
            saldo: i.saldo,
            title: i.descricao,
            subTitle: i.principio_ativo_descricao,
            unidade: i.unidade_sigla,
            inactive: !i.ativo
          }))}
          emptyMessage={!selectedPropriety ? "Selecione uma propriedade nas configurações" : "Nenhum registro encontrado"}
          onEdit={
            (item) => { navigation.navigate('StockItemForm', { id: item.id }) }
          }
        />
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