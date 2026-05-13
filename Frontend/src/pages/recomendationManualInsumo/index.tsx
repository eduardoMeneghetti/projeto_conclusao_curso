import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import ButtonPages from "../../components/ButtonPages";
import ButtonAvance from "../../components/ButtonAvance";
import { AddItemForm, RecomendacaoItem } from "../../components/AddItemForm";
import { useInsumoDatabase, Insumo } from "../../database/useInsumoDatabase";
import { useRecommendationItensDatabase } from "../../database/useRecommendationItensDatabase";
import { useRecommendationDatabase } from "../../database/useRecommendationDatabase";

export default function RecommendationManualInsumo() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosRecommendation = route.params;

    const { getInsumoAtivo } = useInsumoDatabase();
    const { createRecomendation } = useRecommendationDatabase();
    const { createRecommendationItem } = useRecommendationItensDatabase();

    const [itens, setItens] = useState<RecomendacaoItem[]>([]);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);

    const areaAplic: number = dadosRecommendation.areaAplicacao ?? 0;

    useEffect(() => {
        getInsumoAtivo().then((result) => {
            if (result) setInsumos(result);
        });
    }, []);

    function handleRemoverItem(insumo_id: number) {
        setItens(prev => prev.filter(i => i.insumo_id !== insumo_id));
    }

    async function handleSalvar() {
        if (!itens.length) return Alert.alert('Atenção', 'Adicione pelo menos um insumo');

        try {
            const recomendacao = await createRecomendation({
                atividade_safra_id: dadosRecommendation.atividade_safra_id,
                atividade_gleba_id: dadosRecommendation.gleba.atividade_gleba_id,
                data_recomendacao: dadosRecommendation.data_recomendacao,
                operador_id: dadosRecommendation.operador.id,
                recomendante_id: dadosRecommendation.recomendante_id,
                area_aplic: areaAplic,
            });

            if (!recomendacao?.insertedRowI) throw new Error('Erro ao criar recomendação');
            const recomendacaoId = recomendacao.insertedRowI;

            for (const item of itens) {
                await createRecommendationItem({
                    recomendacao_agricola_id: recomendacaoId,
                    insumo_id: item.insumo_id,
                    dose: item.dose,
                    quantidade: item.quantidade,
                });
            }

            Alert.alert('Sucesso', 'Recomendação salva com sucesso!');
            navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' });
        } catch (error) {
            console.error('Erro ao salvar recomendação:', error);
            Alert.alert('Erro', 'Não foi possível salvar a recomendação.');
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TopButton
                title="Insumos da Recomendação"
                onCancelar={() => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })}
            />

            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {itens.length > 0 ? (
                    itens.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemDescricao}>{item.descricao}</Text>
                                <Text style={styles.itemDetalhes}>
                                    Dose: {item.dose.toFixed(2)} {item.unidade}/ha | Qtd: {item.quantidade.toFixed(2)} {item.unidade}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemoverItem(item.insumo_id)}
                            >
                                <Text style={styles.removeText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nenhum insumo adicionado</Text>
                )}
            </ScrollView>

            <View style={styles.addButtonContainer}>
                <ButtonPages
                    title="+ Adicionar insumo"
                    onPress={() => setModalAddItemVisible(true)}
                />
            </View>

            <ButtonAvance
                title="Salvar"
                onSeguir={handleSalvar}
                onVoltar={() => navigation.goBack()}
            />

            <AddItemForm
                mode="recomendacao"
                insumos={insumos}
                areaAplic={areaAplic}
                isVisible={modalAddItemVisible}
                onClose={() => setModalAddItemVisible(false)}
                onAdd={(item) => {
                    const jaExiste = itens.find(i => i.insumo_id === item.insumo_id);
                    if (jaExiste) return alert('Insumo já adicionado');
                    setItens(prev => [...prev, item]);
                }}
            />
        </KeyboardAvoidingView>
    );
}
