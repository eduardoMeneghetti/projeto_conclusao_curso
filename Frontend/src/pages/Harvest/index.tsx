import React, { useState, useEffect } from "react";
import {
    View,
    Text,
} from "react-native"
import { usePropriety } from "../../context/PropContext";
import { styles } from "./sytles";
import ButtonPages from "../../components/ButtonPages";
import Line from "../../components/Line";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TopButton } from "../../components/TopButton";
import { InputText } from "../../components/TextInput";
import { UseHarverst, useHarverstDatabase } from "../../database/useHarverstDatabase";
import { InputDate } from "../../components/InputDate";
import { Button } from "../../components/Button";
import ButtonSelect from "../../components/ButtonSelect";
import { UseActivityHarvest, UseActivityHarvestDatabase } from "../../database/useActivityHarvestDatabase";
import { useActivityDatabase, UseActivity } from "../../database/useActivityDatabase";
import SelectionModal from "../../components/SelectionModal";
import { useAuthSelection } from "../../context/selectionContext";




export default function Harvest() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { selectedPropriety } = usePropriety();
    const { selectedHarvest } = useAuthSelection();
    const { createHarvest, getHarvestById, updateHaverst } = useHarverstDatabase();
    const { createActivityHarvest, getActivityHarvestById, updateActivityHarvestById } = UseActivityHarvestDatabase();
    const { getActivity } = useActivityDatabase();

    const id = route.params?.id;
    const isEditing = !!id;
    const [ativo, setAtivo] = useState(true);

    const [descricao, setDescricao] = useState('');
    const [data_inicio, setDataInicio] = useState<Date | null>(null);
    const [data_final, setDataFinal] = useState<Date | null>(null);

    const [selectedAtividade, setSelectedAtividade] = useState<UseActivity | null>(null);
    const [atividades, setAtividades] = useState<UseActivity[]>([]);
    const [isAtividadeModalVisible, setIsAtividadeModalVisible] = useState(false);


    useEffect(() => {
        getActivity().then((result) => {
            if (result) {
                setAtividades(result);

                if (isEditing) {
                    getHarvestById(id).then((harvest) => {
                        if (harvest) {
                            setDescricao(harvest.descricao);
                            setDataInicio(new Date(harvest.data_inicio));
                            setDataFinal(new Date(harvest.data_final));
                            setAtivo(harvest.ativo);
                        }
                    });

                    getActivityHarvestById(Number(id)).then((activityHarvest) => {
                        if (activityHarvest) {
                            const atividade = result.find(a => a.id === activityHarvest.atividade_id);
                            if (atividade) setSelectedAtividade(atividade);
                        }
                    });
                }
            }
        });
    }, [id]);


    useEffect(() => {
        if (isEditing) return;

        if (selectedAtividade && data_inicio) {
            const anoInicio = data_inicio.getFullYear().toString().slice(-2);
            const anoFinal = (data_inicio.getFullYear() + 1).toString().slice(-2);
            setDescricao(`${selectedAtividade.descricao.toUpperCase()} ${anoInicio}/${anoFinal}`);
        }
    }, [selectedAtividade, data_inicio]);

    useEffect(() => {
        if (isEditing) return;

        if (data_inicio) {
            const umAnoDepois = new Date(data_inicio);
            umAnoDepois.setFullYear(umAnoDepois.getFullYear() + 1);
            setDataFinal(umAnoDepois);
        }
    }, [data_inicio]);

    async function handleSalvar() {
        if (!descricao) return alert("Descrição obrigatória")
        if (!data_inicio) return alert("Data início obrigatória")
        if (!data_final) return alert("Data final obrigatória")
        if (!selectedAtividade) return alert("Atividade obrigatória");

        if (isEditing) {
            await updateHaverst({
                id: Number(id),
                descricao,
                data_inicio: data_inicio.toISOString().split('T')[0],
                data_final: data_final.toISOString().split('T')[0],
                ativo,
            });

            await updateActivityHarvestById({
                safra_id: Number(id),
                atividade_id: selectedAtividade.id
            })

        } else {

            const safra = await createHarvest({
                descricao,
                data_inicio: data_inicio.toISOString().split('T')[0],
                data_final: data_final.toISOString().split('T')[0]
            });

            if (safra?.insertRowId) {
                await createActivityHarvest({
                    safra_id: Number(safra.insertRowId),
                    atividade_id: selectedAtividade.id,
                    propriedade_id: selectedPropriety!.id,
                });
            }
        }

        navigation.navigate('BottomRoutes')
    }

    return (
        <View style={styles.container}>
            <TopButton
                title={isEditing ? 'Edição de Safra' : 'Cadastro de Safra'}
                onVoltar={
                    () => { navigation.navigate('BottomRoutes') }
                }
            />
            <View style={styles.mid}>
                <InputDate
                    title="Data início"
                    isRequired={true}
                    value={data_inicio}
                    onChange={setDataInicio}
                />

                <InputDate
                    title="Data final"
                    isRequired={true}
                    value={data_final}
                    onChange={setDataFinal}
                />

                <View style={styles.InLine}>
                    <ButtonSelect
                        isRequired={true}
                        title="Propriedade:"
                        text={selectedPropriety!.descricao}
                    />

                    <ButtonSelect
                        title="Atividade:"
                        isRequired={true}
                        text={selectedAtividade ? selectedAtividade.descricao : "Selecione uma atividade"}
                        onPress={() => setIsAtividadeModalVisible(true)}
                    />
                </View>


                <InputText
                    isRequired={true}
                    title="Nome da safra"
                    value={descricao}
                    onChangeText={setDescricao}
                />


                <ButtonSelect
                    isRequired={false}
                    title="Cadastro ativo:"
                    text={isEditing ? (ativo ? 'Sim' : 'Não') : 'Sim'}
                    onPress={isEditing ? () => setAtivo(!ativo) : undefined}
                />

            </View>

            <View style={styles.salvar}>
                <Button
                    title="Salvar"
                    onPress={handleSalvar}
                />
            </View>


            <SelectionModal
                isVisible={isAtividadeModalVisible}
                onClose={() => setIsAtividadeModalVisible(false)}
                title="Selecione a Atividade"
                data={atividades.map(a => ({
                    id: String(a.id),
                    title: a.descricao,
                    inactive: !a.ativo
                }))}
                selectedId={selectedAtividade ? String(selectedAtividade.id) : null}
                onSelect={(item) => {
                    const atividade = atividades.find(a => String(a.id) === item.id);
                    if (atividade) setSelectedAtividade(atividade);
                }}
            />

        </View>
    );
}