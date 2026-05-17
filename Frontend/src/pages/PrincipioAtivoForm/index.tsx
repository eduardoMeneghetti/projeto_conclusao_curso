import React, { useEffect, useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Modal from 'react-native-modal';
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";
import SelectionModal from "../../components/SelectionModal";
import { usePrincipioAtivoDatabase } from "../../database/usePrincipioAtivoDatabase";
import { UsePrincipiosAtivosNutrientes, NutrienteItem } from "../../database/UsePrincipiosAtivosNutrientes";
import { useNutrienteDatabase, NutrienteDatabase } from "../../database/useNutrienteDatabase";

export function PrincipioAtivoForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const { createPrincipioAtivo, getPrincipioAtivoById, updatePrincipioAtivo } = usePrincipioAtivoDatabase();
    const { createPrincipioNutriente, getNutrientesByPrincipioId, deleteNutrientesByPrincipioId } = UsePrincipiosAtivosNutrientes();
    const { getNutrientesAll } = useNutrienteDatabase();

    const id = route.params?.id;
    const isEditing = !!id;

    const [descricao, setDescricao] = useState('');
    const [ativo, setAtivo] = useState(true);

    const [nutrientes, setNutrientes] = useState<NutrienteItem[]>([]);
    const [nutrientesDisponiveis, setNutrientesDisponiveis] = useState<NutrienteDatabase[]>([]);
    const [modalNutrienteVisible, setModalNutrienteVisible] = useState(false);
    const [selectionModalVisible, setSelectionModalVisible] = useState(false);
    const [nutrienteSelecionado, setNutrienteSelecionado] = useState<NutrienteDatabase | null>(null);
    const [percentual, setPercentual] = useState('');

    useEffect(() => {
        getNutrientesAll().then(setNutrientesDisponiveis);
        //console.log(nutrientesDisponiveis);

        if (isEditing) {
            getPrincipioAtivoById(id).then((pa) => {
                if (pa) {
                    setDescricao(pa.descricao);
                    setAtivo(pa.ativo);
                }
            });
            getNutrientesByPrincipioId(Number(id)).then(setNutrientes);
        }
    }, [id]);

    function handleFecharModal() {
        setNutrienteSelecionado(null);
        setPercentual('');
        Keyboard.dismiss();
        setModalNutrienteVisible(false);
    }

    function handleAdicionarNutriente() {
        if (!nutrienteSelecionado) return alert('Selecione um nutriente');
        const perc = parseFloat(percentual.replace(',', '.'));
        if (isNaN(perc) || perc <= 0 || perc > 100) return alert('Percentual inválido (0,01 a 100)');
        if (nutrientes.find(n => n.nutriente_id === nutrienteSelecionado.id)) return alert('Nutriente já adicionado');

        setNutrientes(prev => [...prev, {
            nutriente_id: nutrienteSelecionado.id,
            descricao: nutrienteSelecionado.descricao,
            sigla: nutrienteSelecionado.sigla,
            percentual: perc,
        }]);
        handleFecharModal();
    }

    function handleRemoverNutriente(nutriente_id: number) {
        setNutrientes(prev => prev.filter(n => n.nutriente_id !== nutriente_id));
    }

    async function handleSalvar() {
        if (!descricao) return Alert.alert("Atenção", "Descrição obrigatória");

        try {
            let principioAtivoId: number;

            if (isEditing) {
                await updatePrincipioAtivo({ id: Number(id), descricao, ativo });
                await deleteNutrientesByPrincipioId(Number(id));
                principioAtivoId = Number(id);
            } else {
                const result = await createPrincipioAtivo({ descricao });
                if (!result?.insertRowId) throw new Error('Erro ao criar princípio ativo');
                principioAtivoId = parseInt(result.insertRowId);
            }

            for (const nutriente of nutrientes) {
                await createPrincipioNutriente({
                    principios_ativo_id: principioAtivoId,
                    nutriente_id: nutriente.nutriente_id,
                    percentual: nutriente.percentual,
                });
            }

            Alert.alert('Sucesso', 'Princípio ativo salvo com sucesso!');
            navigation.navigate('PrincipioAtivo');
        } catch (error) {
            console.error('Erro ao salvar princípio ativo:', error);
            Alert.alert('Erro', 'Não foi possível salvar o princípio ativo.');
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TopButton
                    title={isEditing ? "Edição de Princípio Ativo" : "Cadastro de Princípio Ativo"}
                    onVoltar={() => navigation.navigate('PrincipioAtivo')}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.form}>
                        <InputText
                            title="Descrição"
                            isRequired={true}
                            value={descricao}
                            onChangeText={setDescricao}
                        />

                        <ButtonSelect
                            title="Cadastro ativo:"
                            isRequired={true}
                            text={ativo ? 'Sim' : 'Não'}
                            onPress={isEditing ? () => setAtivo(!ativo) : undefined}
                        />
                    </View>

                    <View style={styles.nutrientesSection}>
                        <Text style={styles.nutrientesTitle}>Nutrientes</Text>

                        {nutrientes.map((item) => (
                            <View key={item.nutriente_id} style={styles.nutrienteRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.nutrienteDescricao}>{item.descricao} ({item.sigla})</Text>
                                    <Text style={styles.nutrientePercentual}>{Number(item.percentual).toFixed(2)}%</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoverNutriente(item.nutriente_id)}
                                >
                                    <Text style={styles.removeText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {nutrientes.length === 0 && (
                            <Text style={styles.emptyText}>Nenhum nutriente adicionado</Text>
                        )}

                        <TouchableOpacity
                            style={styles.addNutrienteButton}
                            onPress={() => setModalNutrienteVisible(true)}
                        >
                            <Text style={styles.addNutrienteText}>+ Adicionar nutriente</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Button title="Salvar" onPress={handleSalvar} />
            </KeyboardAvoidingView>

            <Modal
                isVisible={modalNutrienteVisible}
                onBackdropPress={handleFecharModal}
                onBackButtonPress={handleFecharModal}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                style={{ justifyContent: 'flex-end', margin: 0 }}
                useNativeDriver={true}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Adicionar Nutriente</Text>

                        <TouchableOpacity
                            style={styles.selecionarNutriente}
                            onPress={() => setSelectionModalVisible(true)}
                        >
                            <Text style={styles.selecionarNutrienteText}>
                                {nutrienteSelecionado
                                    ? `${nutrienteSelecionado.descricao} (${nutrienteSelecionado.sigla})`
                                    : 'Selecionar nutriente...'}
                            </Text>
                        </TouchableOpacity>

                        <InputText
                            title="Percentual (%):"
                            isRequired={true}
                            value={percentual}
                            onChangeText={(text) => {
                                if (/^\d*[.,]?\d{0,2}$/.test(text)) setPercentual(text);
                            }}
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                            placeholder="Ex: 12,50"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleFecharModal}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleAdicionarNutriente}>
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>

                <SelectionModal
                    isVisible={selectionModalVisible}
                    onClose={() => setSelectionModalVisible(false)}
                    title="Selecione o nutriente"
                    data={nutrientesDisponiveis.map(n => ({
                        id: String(n.id),
                        title: `${n.descricao} (${n.sigla})`
                    }))}
                    selectedId={nutrienteSelecionado ? String(nutrienteSelecionado.id) : null}
                    onSelect={(item) => {
                        const nutriente = nutrientesDisponiveis.find(n => String(n.id) === item.id);
                        if (nutriente) setNutrienteSelecionado(nutriente);
                    }}
                />
            </Modal>
        </View>
    );
}