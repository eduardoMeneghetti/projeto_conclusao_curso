import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { styles } from "./styles";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { TopButton } from "../../components/TopButton";
import { Button } from "../../components/Button";
import ButtonPages from "../../components/ButtonPages";
import { AddItemForm } from "../../components/AddItemForm";
import { useInsumoDatabase, Insumo } from "../../database/useInsumoDatabase";
import { useAjusteEstoqueDatabase } from "../../database/useAjusteEstoqueDatabase";
import { UseMovEstoqueInsumos } from "../../database/useMovEstoqueInsumos";

type Item = {
    insumo_id: number;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    unidade: string;
};

export default function StockItemMovItens() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosAjuste = route.params;

    const { getInsumoAtivo } = useInsumoDatabase();
    const { create, getMovItensById } = useAjusteEstoqueDatabase();
    const { createMovInsumo, validarSaidaSemNegatacao } = UseMovEstoqueInsumos();

    const [itens, setItens] = useState<Item[]>([]);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);
    const isEditing = !!dadosAjuste.ajuste_id;

    useEffect(() => {
        console.log("Buscando insumos ativos...")
        getInsumoAtivo().then((result) => {
            console.log("insumos ativos localizados: ", result)
            if (result) setInsumos(result)
        });
    }, [])

    useEffect(() => {
        if (isEditing) {
            getMovItensById(dadosAjuste.ajuste_id).then((itensCarregados) => {
                console.log('Itens carregados: ', itensCarregados);
                setItens(itensCarregados);
            });
        }
    }, [dadosAjuste.ajuste_id, isEditing]);

    function handleRemoverItem(insumo_id: number) {
        if (isEditing) {
            alert('Não é possível editar itens de uma movimentação existente');
            return;
        }
        setItens(prev => prev.filter(i => i.insumo_id !== insumo_id));
    }

    async function handleSalvar() {
        if (isEditing) {
            alert('Movimentações existentes não podem ser editadas');
            return;
        }

        if (!itens.length) return alert('Adicione pelo menos um item');

        try {
            console.log("iniciando movimentacao dos insumos adicionados");

            if (dadosAjuste.entrada_saida === 'S') {
                for (const item of itens) {
                    const validacao = await validarSaidaSemNegatacao(
                        item.insumo_id,
                        item.quantidade,
                        dadosAjuste.propriedade_id,
                        item.descricao
                    );

                    if (!validacao.valido) {
                        return Alert.alert("Operação Bloqueada", validacao.mensagem || "Erro ao validar saída");
                    }
                }
            }

            const mov = await create({
                usuario_id: dadosAjuste.usuario_id,
                propriedade_id: dadosAjuste.propriedade_id,
                entrada_saida: dadosAjuste.entrada_saida,
                data: dadosAjuste.data,
                observacao: dadosAjuste.observacao
            })

            if (!mov.insertedRowId) return Alert.alert("Erro", "Erro ao criar movimentacão");
            const mov_id = Number(mov.insertedRowId);

            for (const item of itens) {
                await createMovInsumo({
                    ajuste_estoque_id: mov_id,
                    insumo_id: item.insumo_id,
                    quantidade: item.quantidade,
                    valor_unitario: item.valor_unitario
                }, dadosAjuste.entrada_saida);  
            }

            console.log("Sucesso ao cadastrar movimentacao de estoque!");
            Alert.alert("Sucesso", "Movimentação cadastrada com sucesso!");
        } catch (error) {
            console.error("Errro ao cadastrar movimentacao: ", error)
            Alert.alert("Erro", "Erro ao cadastrar movimentação");
        }

        navigation.navigate('BottomRoutes' as any, { screen: 'Estoque' });
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TopButton
                title="Itens do ajuste"
                onVoltar={() => navigation.goBack()}
            />

            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {itens.length > 0 ? (
                    itens.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemDescricao}>{item.descricao}</Text>
                                <Text style={styles.itemDetalhes}>
                                    Qtd: {item.quantidade.toLocaleString('pt-BR', {maximumFractionDigits: 2})} {item.unidade} | Valor: R$ {item.valor_unitario.toFixed(2)}
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
                    <Text style={styles.emptyText}>Nenhum item adicionado</Text>
                )}
            </ScrollView>

            <View style={styles.addButtonContainer}>
                {!isEditing && (
                    <ButtonPages
                        title="+ Adicionar item"
                        onPress={() => setModalAddItemVisible(true)}
                    />
                )}
            </View>

            <Button title={isEditing ? "Voltar" : "Salvar"} onPress={isEditing ? () => navigation.goBack() : handleSalvar} />

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