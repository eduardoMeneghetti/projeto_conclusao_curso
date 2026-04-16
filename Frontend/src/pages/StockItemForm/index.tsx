import React, { useEffect, useState } from "react";
import {
    Alert,
    View
} from 'react-native';
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/core";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";
import { useInsumoDatabase } from "../../database/useInsumoDatabase";
import { useUnidadesMedida, UseUnidadesMedida } from "../../database/useUnidadesMedida";
import { PrincipioAtivoDatabase, usePrincipioAtivoDatabase } from "../../database/usePrincipioAtivoDatabase";
import SelectionModal from "../../components/SelectionModal";

export default function StockItemForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { createInsumo, getInsumoById, getInsumoAll, updateInsumo, getInsumoByDescricao } = useInsumoDatabase();
    const { getUnidadesMedidaById, getUnidadesMedidaAll } = useUnidadesMedida();
    const { getPrincipioAtivoById, getPrincipioAtivoAll } = usePrincipioAtivoDatabase();

    const id = Number(route.params?.id);
    const isEditing = !!id;

    const [descricao, setDescricao] = useState('');
    const [semente, setSemente] = useState(false);
    const [ativo, setAtivo] = useState(true);

    const [selectedUnidadeMedida, setSelectedUnidadeMedida] = useState<UseUnidadesMedida | null>(null);
    const [unidadesMedida, setUnidadesMedida] = useState<UseUnidadesMedida[]>([]);
    const [isUnidadeModalVisible, setIsUnidadeModalVisible] = useState(false);

    const [selectedPrincipioAtivo, setSelectedPrincipioAtivo] = useState<PrincipioAtivoDatabase | null>(null);
    const [principiosAtivos, setPrincipiosAtivos] = useState<PrincipioAtivoDatabase[]>([]);
    const [isPrincipioModalVisible, setIsPrincipioModalVisible] = useState(false);

    useEffect(() => {
        getUnidadesMedidaAll().then((result) => {
            if (result) setUnidadesMedida(result);
        });

        getPrincipioAtivoAll().then((result) => {
            if (result) setPrincipiosAtivos(result);
        });

        if (isEditing) {
            getInsumoById(id).then((insumo) => {
                if (insumo) {
                    setDescricao(insumo.descricao);
                    setAtivo(insumo.ativo);
                    setSemente(insumo.semente);


                    getUnidadesMedidaById(insumo.unidades_medida_id).then((unidade) => {
                        if (unidade) setSelectedUnidadeMedida(unidade);
                    });


                    getPrincipioAtivoById(insumo.principios_ativos_id).then((principio) => {
                        if (principio) setSelectedPrincipioAtivo(principio);
                    });
                }
            });
        }
    }, [id]);

    async function handleSalvar() {
        if (!descricao) return Alert.alert("Atenção", "Descrição é obrigatória");
        if (!selectedUnidadeMedida) return Alert.alert("Atenção", "Unidade de medida é obirgatória");
        if (!selectedPrincipioAtivo) return Alert.alert("Atenção", "Principio ativo é obirgatório")

        const insumoExistente = await getInsumoByDescricao(descricao, isEditing ? Number(id) : undefined);
        if (insumoExistente) {
            return Alert.alert(
                "Insumo Duplicado",
                `Já existe um insumo cadastrado com o nome "${descricao}". Por favor, use um nome diferente.`
            );
        }

        if (isEditing) {
            console.log('Editando insumo....')
            await updateInsumo({
                id: Number(id),
                descricao,
                semente,
                unidades_medida_id: selectedUnidadeMedida.id,
                principios_ativos_id: selectedPrincipioAtivo.id,
                ativo,
            });
            Alert.alert("Sucesso", "Insumo atualizado com sucesso!");
        } else {

            try {
                console.log('Cadastro de insumo....')
                await createInsumo({
                    descricao,
                    semente,
                    unidades_medida_id: selectedUnidadeMedida.id,
                    principios_ativos_id: selectedPrincipioAtivo.id,
                });

                console.log('insumo cadastrado com Sucesso!')
                Alert.alert("Sucesso", "Insumo cadastrado com sucesso!");
            } catch (error) {
                console.error('Erro ao cadastrar insumo', error)
                Alert.alert("Erro", "Erro ao cadastrar insumo. Tente novamente.");
                return null
            }

        }

        navigation.goBack();
    }


    return (
        <View style={styles.container}>

            <TopButton
                title={isEditing ? 'Edição de insumo' : 'Cadastro de insumo'}
                onVoltar={
                    () => {
                        navigation.goBack();
                    }
                }
            />

            <View style={styles.form}>

                <InputText
                    title="Descrição:"
                    isRequired={true}
                    value={descricao}
                    onChangeText={setDescricao}
                />

                <ButtonSelect
                    title="Unidade de medida:"
                    isRequired={true}
                    text={selectedUnidadeMedida ? `${selectedUnidadeMedida.descricao} (${selectedUnidadeMedida.sigla})` : "Selecione uma unidade"}
                    onPress={() => setIsUnidadeModalVisible(true)}
                />

                <ButtonSelect
                    title="Princípio ativo:"
                    isRequired={true}
                    text={selectedPrincipioAtivo ? selectedPrincipioAtivo.descricao : "Selecione um Princípio ativo"}
                    onPress={() => setIsPrincipioModalVisible(true)}
                />

                <View style={styles.ButtonsRow}>

                    <ButtonSelect
                        title="Semente:"
                        text={semente ? 'Sim' : 'Não'}
                        onPress={
                            () => setSemente(!semente)
                        }
                        isRequired={false}
                    />

                    <ButtonSelect
                        title="Cadastro ativo:"
                        text={isEditing ? (ativo ? 'Sim' : 'Não') : 'Sim'}
                        onPress={
                            isEditing ? () => setAtivo(!ativo) : undefined
                        }
                        isRequired={false}
                    />

                </View>

            </View>

            <Button
                title="Salvar"
                onPress={handleSalvar}
            />

            <SelectionModal
                isVisible={isUnidadeModalVisible}
                onClose={() => setIsUnidadeModalVisible(false)}
                title="Selecione a Unidade de Medida"
                data={unidadesMedida.map(u => ({
                    id: String(u.id),
                    title: `${u.descricao} (${u.sigla})`,
                    inactive: !u.ativo
                }))}
                selectedId={selectedUnidadeMedida ? String(selectedUnidadeMedida.id) : null}
                onSelect={(item) => {
                    const unidade = unidadesMedida.find(u => String(u.id) === item.id);
                    if (unidade) setSelectedUnidadeMedida(unidade);
                }}
            />

            <SelectionModal
                isVisible={isPrincipioModalVisible}
                onClose={() => setIsPrincipioModalVisible(false)}
                title="Selecione o Princípio Ativo"
                data={principiosAtivos.map(p => ({
                    id: String(p.id),
                    title: p.descricao,
                    inactive: !p.ativo
                }))}
                selectedId={selectedPrincipioAtivo ? String(selectedPrincipioAtivo.id) : null}
                onSelect={(item) => {
                    const principio = principiosAtivos.find(p => String(p.id) === item.id);
                    if (principio) setSelectedPrincipioAtivo(principio);
                }}
            />

        </View>
    )
}