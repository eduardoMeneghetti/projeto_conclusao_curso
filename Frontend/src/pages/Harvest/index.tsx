import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image
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
import { useGlebaDatabase } from "../../database/useGlebas";
import { useActivityGlebaDatabase } from "../../database/useActivityGlebaDatabase";
import { useSQLiteContext } from "expo-sqlite";

type GlebaComStatus = {
    id: number;
    descricao: string;
    area: number;
    associada: boolean;
}


export default function Harvest() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const database = useSQLiteContext();
    const { selectedPropriety } = usePropriety();
    const { selectedHarvest, setSelectedHarvest, selectedAtividadeSafraId } = useAuthSelection();
    const { createHarvest, getHarvestById, updateHaverst } = useHarverstDatabase();
    const { createActivityHarvest, getActivityHarvestById, updateActivityHarvestById } = UseActivityHarvestDatabase();
    const { getGlebaInPropriety, getGlebasInActivity } = useGlebaDatabase();
    const { createActivityGleba, deleteActivityGleba } = useActivityGlebaDatabase();
    const { getActivity } = useActivityDatabase();

    const id = route.params?.id;
    const isEditing = !!id;
    const [ativo, setAtivo] = useState(true);

    const [descricao, setDescricao] = useState('');
    const [data_inicio, setDataInicio] = useState<Date | null>(null);
    const [data_final, setDataFinal] = useState<Date | null>(null);
    const [glebasComStatus, setGlebasComStatus] = useState<GlebaComStatus[]>([]);
    const [atividadeSafraIdLocal, setAtividadeSafraIdLocal] = useState<number | null>(null);

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
                            setAtividadeSafraIdLocal(activityHarvest.id);  
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

    async function loadGlebas() {
        if (!selectedPropriety) return;

        const idParaUsar = isEditing ? atividadeSafraIdLocal : selectedAtividadeSafraId;

        console.log('loadGlebas: selectedPropriety', selectedPropriety.id);
        console.log('loadGlebas: idParaUsar', idParaUsar);

        const todasGlebasRaw = await getGlebaInPropriety(selectedPropriety.id);

        const uniqueGlebas = new Map();
        todasGlebasRaw.forEach(g => {
            if (!uniqueGlebas.has(g.id)) {
                uniqueGlebas.set(g.id, { id: g.id, descricao: g.descricao, area_hectares: g.area_hectares });
            }
        });
        const todasGlebas = Array.from(uniqueGlebas.values());

        let glebasStatus;

        if (idParaUsar) {
            const glebasNaAtividadeRaw = await getGlebasInActivity(idParaUsar);

            const uniqueGlebasNaAtividade = new Map();
            glebasNaAtividadeRaw.forEach(g => {
                if (!uniqueGlebasNaAtividade.has(g.id)) {
                    uniqueGlebasNaAtividade.set(g.id, g.id);
                }
            });
            const idsNaAtividade = new Set(uniqueGlebasNaAtividade.keys());

            glebasStatus = todasGlebas.map(g => ({
                id: g.id,
                descricao: g.descricao,
                area: g.area_hectares,
                associada: idsNaAtividade.has(g.id)
            }));
        } else {
            glebasStatus = todasGlebas.map(g => ({
                id: g.id,
                descricao: g.descricao,
                area: g.area_hectares,
                associada: false
            }));
        }

        setGlebasComStatus(glebasStatus);
    }

    useEffect(() => {
        loadGlebas();
    }, [selectedPropriety, selectedAtividadeSafraId, atividadeSafraIdLocal]);

    async function handleToggleGleba(gleba: GlebaComStatus) {
        const idParaUsar = isEditing ? atividadeSafraIdLocal : selectedAtividadeSafraId;

        if (isEditing && idParaUsar) {
            if (gleba.associada) {
                await deleteActivityGleba(gleba.id, idParaUsar);
            } else {
                await createActivityGleba({
                    gleba_id: gleba.id,
                    atividade_safra_id: idParaUsar
                });
            }
            await loadGlebas();
        } else {
            setGlebasComStatus(prev =>
                prev.map(g =>
                    g.id === gleba.id ? { ...g, associada: !g.associada } : g
                )
            );
        }
    }

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
            });

        } else {
            const safra = await createHarvest({
                descricao,
                data_inicio: data_inicio.toISOString().split('T')[0],
                data_final: data_final.toISOString().split('T')[0]
            });

            if (safra?.insertRowId) {
                const atividadeHarvest = await createActivityHarvest({
                    safra_id: Number(safra.insertRowId),
                    atividade_id: selectedAtividade.id,
                    propriedade_id: selectedPropriety!.id,
                });

                if (atividadeHarvest?.insertRowId) {
                    const glebasAssociadas = glebasComStatus.filter(g => g.associada);
                    for (const gleba of glebasAssociadas) {
                        await createActivityGleba({
                            gleba_id: gleba.id,
                            atividade_safra_id: Number(atividadeHarvest.insertRowId)
                        });
                    }
                }
            }
        }

        navigation.navigate('BottomRoutes');
    }

    return (
        <View style={styles.container}>
            <TopButton
                title={isEditing ? 'Edição de Safra' : 'Cadastro de Safra'}
                onVoltar={
                    () => { navigation.navigate('BottomRoutes') }
                }
            />

            <ScrollView style={styles.scroll}>
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

                    {glebasComStatus.length > 0 && (
                        <View style={styles.glebasList}>
                            <Text style={styles.glebasTitle}>Talhões da propriedade:</Text>

                            {glebasComStatus.map((gleba) => (
                                <View key={gleba.id} style={styles.glebaItem}>
                                    <View style={styles.glebaInfo}>
                                        <Text style={styles.glebaDescricao}>{gleba.descricao}</Text>
                                        <Text style={styles.glebaArea}>{gleba.area.toFixed(2)} ha</Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleToggleGleba(gleba)}
                                        style={styles.glebaButton}
                                    >
                                        <Image
                                            source={
                                                gleba.associada
                                                    ? require('../../assets/icon/remover.png')
                                                    : require('../../assets/icon/selecionado.png')
                                            }
                                            style={styles.glebaButtonIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

            </ScrollView>


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