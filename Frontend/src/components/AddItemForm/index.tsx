import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import Modal from 'react-native-modal';
import { styles } from "./styles";
import { InputText } from "../TextInput";
import SelectionModal from "../SelectionModal";

type Insumo = {
    id: number;
    descricao: string;
    unidade_sigla: string;
};

export type RecomendacaoItem = {
    insumo_id: number;
    descricao: string;
    quantidade: number;
    dose: number;
    unidade: string;
};

export type EstoqueItem = {
    insumo_id: number;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    unidade: string;
};

type BaseProps = {
    insumos: Insumo[];
    isVisible: boolean;
    onClose: () => void;
};

type RecomendacaoProps = BaseProps & {
    mode: 'recomendacao';
    areaAplic: number;
    onAdd: (item: RecomendacaoItem) => void;
};

type EstoqueProps = BaseProps & {
    mode: 'estoque';
    onAdd: (item: EstoqueItem) => void;
};

type Props = RecomendacaoProps | EstoqueProps;

function parseBRL(value: string): number {
    return parseFloat(value.replace(',', '.'));
}

function isDecimalInput(text: string): boolean {
    return /^\d*[.,]?\d{0,2}$/.test(text);
}

export function AddItemForm(props: Props) {
    const { insumos, isVisible, onClose } = props;

    const [selectionModalVisible, setSelectionModalVisible] = useState(false);
    const [insumoSelecionado, setInsumoSelecionado] = useState<Insumo | null>(null);
    const [quantidade, setQuantidade] = useState('');
    const [dose, setDose] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');

    useEffect(() => {
        if (!isVisible) setSelectionModalVisible(false);
    }, [isVisible]);

    function handleDoseChange(text: string) {
        if (!isDecimalInput(text)) return;
        setDose(text);
        if (props.mode === 'recomendacao') {
            const d = parseBRL(text);
            setQuantidade(!isNaN(d) && props.areaAplic > 0
                ? (d * props.areaAplic).toFixed(2)
                : ''
            );
        }
    }

    function handleQuantidadeChange(text: string) {
        if (!isDecimalInput(text)) return;
        setQuantidade(text);
        if (props.mode === 'recomendacao') {
            const q = parseBRL(text);
            setDose(!isNaN(q) && props.areaAplic > 0
                ? (q / props.areaAplic).toFixed(2)
                : ''
            );
        }
    }

    function resetForm() {
        setInsumoSelecionado(null);
        setQuantidade('');
        setDose('');
        setValorUnitario('');
    }

    function handleConfirmar() {
        if (!insumoSelecionado) return alert('Selecione um insumo');

        if (props.mode === 'recomendacao') {
            if (!dose) return alert('Informe a dose ou a quantidade');
            const d = parseBRL(dose);
            const q = parseBRL(quantidade);
            if (isNaN(d) || d <= 0) return alert('Dose inválida');
            if (isNaN(q) || q <= 0) return alert('Quantidade inválida');

            props.onAdd({
                insumo_id: insumoSelecionado.id,
                descricao: insumoSelecionado.descricao,
                dose: d,
                quantidade: q,
                unidade: insumoSelecionado.unidade_sigla,
            });
        } else {
            if (!quantidade) return alert('Quantidade obrigatória');
            if (!valorUnitario) return alert('Valor unitário obrigatório');
            const q = parseBRL(quantidade);
            const v = parseBRL(valorUnitario);
            if (isNaN(q) || q <= 0) return alert('Quantidade inválida');
            if (isNaN(v) || v < 0) return alert('Valor unitário inválido');

            props.onAdd({
                insumo_id: insumoSelecionado.id,
                descricao: insumoSelecionado.descricao,
                quantidade: q,
                valor_unitario: v,
                unidade: insumoSelecionado.unidade_sigla,
            });
        }

        resetForm();
        Keyboard.dismiss();
        onClose();
    }

    function handleCancelar() {
        resetForm();
        setSelectionModalVisible(false);
        Keyboard.dismiss();
        setTimeout(() => onClose(), 100);
    }

    const unidade = insumoSelecionado?.unidade_sigla ?? 'un';

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

                    {props.mode === 'recomendacao' ? (
                        <>
                            <InputText
                                title={`Dose (${unidade}/ha):`}
                                isRequired={true}
                                value={dose}
                                onChangeText={handleDoseChange}
                                keyboardType="decimal-pad"
                                returnKeyType="next"
                                placeholder="Ex: 2,50"
                            />
                            <InputText
                                title={`Quantidade total (${unidade}):`}
                                isRequired={true}
                                value={quantidade}
                                onChangeText={handleQuantidadeChange}
                                keyboardType="decimal-pad"
                                returnKeyType="done"
                                placeholder="Ex: 12,50"
                            />
                        </>
                    ) : (
                        <>
                            <InputText
                                title={`Quantidade (${unidade}):`}
                                isRequired={true}
                                value={quantidade}
                                onChangeText={handleQuantidadeChange}
                                keyboardType="decimal-pad"
                                returnKeyType="next"
                                placeholder="Ex: 10,00"
                            />
                            <InputText
                                title="Valor unitário (R$):"
                                isRequired={true}
                                value={valorUnitario}
                                onChangeText={(text) => {
                                    if (isDecimalInput(text)) setValorUnitario(text);
                                }}
                                keyboardType="decimal-pad"
                                returnKeyType="done"
                                placeholder="Ex: 5,00"
                            />
                        </>
                    )}

                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmar}>
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <SelectionModal
                isVisible={selectionModalVisible}
                onClose={() => setSelectionModalVisible(false)}
                title="Selecione o Insumo"
                data={insumos.map(i => ({
                    id: String(i.id),
                    title: `${i.descricao} (${i.unidade_sigla})`
                }))}
                selectedId={insumoSelecionado ? String(insumoSelecionado.id) : null}
                onSelect={(item) => {
                    const insumo = insumos.find(i => String(i.id) === item.id);
                    if (insumo) setInsumoSelecionado(insumo);
                }}
            />
        </Modal>
    );
}
