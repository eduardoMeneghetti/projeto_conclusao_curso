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
import { AddItemForm } from "../../components/AddItemForm";
import { useInsumoDatabase, Insumo } from "../../database/useInsumoDatabase";

type Item = {
    insumo_id: number;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    unidade: string;
};

export default function RecommendationManualInsumo() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosRecommendation = route.params;

    const { getInsumoAtivo } = useInsumoDatabase();

    const [itens, setItens] = useState<Item[]>([]);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);

    useEffect(() => {
        console.log("Buscando insumos ativos...")
        getInsumoAtivo().then((result) => {
            console.log("insumos ativos localizados: ", result)
            if (result) setInsumos(result)
        });
    }, [])

    function handleRemoverItem(insumo_id: number) {
        setItens(prev => prev.filter(i => i.insumo_id !== insumo_id));
    }

    function handleSalvar() {
        if (!itens.length) return alert('Adicione pelo menos um insumo');

        console.log("Insumos da recomendação: ", itens);
        console.log("Dados da recomendação: ", dadosRecommendation);

        Alert.alert("Sucesso", "Recomendação salva com sucesso!");
        navigation.navigate('BottomRoutes' as any, { screen: 'Recomendação' });
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
                                    Qtd: {item.quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {item.unidade} | Valor: R$ {item.valor_unitario.toFixed(2)}
                                </Text>
                                <Text style={styles.itemDetalhes}>
                                    Total: R$ {(item.quantidade * item.valor_unitario).toFixed(2)}
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
                insumos={insumos}
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