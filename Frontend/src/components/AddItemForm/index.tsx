// components/AddItemForm/index.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import Modal from 'react-native-modal';
import { styles } from "./styles";
import { InputText } from "../TextInput";
import SelectionModal from "../SelectionModal";

type Item = {
    insumo_id: number;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    unidade: string;
};

type Insumo = {
    id: number;
    descricao: string;
    unidade_sigla: string;
};

type Props = {
    insumos: Insumo[];
    onAdd: (item: Item) => void;
    isVisible: boolean;
    onClose: () => void;
};

export function AddItemForm({ insumos, onAdd, isVisible, onClose }: Props) {
    const [selectionModalVisible, setSelectionModalVisible] = useState(false);
    const [insumoSelecionado, setInsumoSelecionado] = useState<Insumo | null>(null);
    const [quantidade, setQuantidade] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [insumosDisponibles, setInsumosDisponibles] = useState<any[]>([]);

    useEffect(() => {
        if (!isVisible) {
            setSelectionModalVisible(false);
        }
    }, [isVisible]);

    function parseBRL(value: string): number {
        return Number(value.replace(',', '.'));
    }

    useEffect(() => {
        if (insumos && Array.isArray(insumos)) {
            setInsumosDisponibles(insumos);
        }
    }, [insumos]);

    function handleConfirmar() {
        if (!insumoSelecionado) return alert('Selecione um insumo');
        if (!quantidade) return alert('Quantidade obrigatória');
        if (!valorUnitario) return alert('Valor unitário obrigatório');

        const qtd = parseBRL(quantidade);
        const valor = parseBRL(valorUnitario);

        if(isNaN(qtd) || qtd < 0) return alert('Quantidade inválida');
        if(isNaN(valor) || valor < 0) return alert('Valor inválida');

        onAdd({
            insumo_id: insumoSelecionado.id,
            descricao: insumoSelecionado.descricao,
            quantidade: qtd,
            valor_unitario: valor,
            unidade: insumoSelecionado.unidade_sigla
        });

        setInsumoSelecionado(null);
        setQuantidade('');
        setValorUnitario('');
        Keyboard.dismiss();
        onClose();
    }

    function handleCancelar() {
        setInsumoSelecionado(null);
        setQuantidade('');
        setValorUnitario('');
        setSelectionModalVisible(false);
        Keyboard.dismiss();
        setTimeout(() => onClose(), 100);
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={handleCancelar}
            onBackButtonPress={handleCancelar}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            style={styles.modal}
            propagateSwipe
            useNativeDriver={true}
            backdropColor="rgba(0, 0, 0, 0.3)"
            backdropOpacity={0.3}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Adicionar Item</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.selecionarInsumo}
                        onPress={() => setSelectionModalVisible(true)}
                    >
                        <Text style={styles.selecionarInsumoText}>
                            {insumoSelecionado ? insumoSelecionado.descricao : 'Selecionar insumo...'}
                        </Text>
                    </TouchableOpacity>

                    <InputText
                        title="Quantidade:"
                        isRequired={true}
                        value={quantidade}
                        onChangeText={setQuantidade}
                        keyboardType="numeric"
                        returnKeyType="next"
                    />

                    <InputText
                        title="Valor unitário:"
                        isRequired={true}
                        value={valorUnitario}
                        onChangeText={setValorUnitario}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />

                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmar}>
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <SelectionModal
                isVisible={selectionModalVisible}
                onClose={() => setSelectionModalVisible(false)}
                title="Selecione o Insumo"
                data={insumosDisponibles && insumosDisponibles.length > 0 ? insumosDisponibles.map(i => ({
                    id: String(i.id),
                    title: `${i.descricao} (${i.unidade_sigla})`
                })) : []}
                selectedId={insumoSelecionado ? String(insumoSelecionado.id) : null}
                onSelect={(item) => {
                    const insumo = insumosDisponibles.find(i => String(i.id) === item.id);
                    if (insumo) setInsumoSelecionado(insumo);
                }}
            />

        </Modal>
    );
}