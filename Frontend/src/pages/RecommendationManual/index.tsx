import React, { useEffect, useState } from "react";
import { Alert, View } from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import ButtonSelect from "../../components/ButtonSelect";
import ButtonAvance from "../../components/ButtonAvance";
import { InputDate } from "../../components/InputDate";
import { usePropriety } from "../../context/PropContext";
import { useAuth } from "../../context/AuthContext";
import SelectionModal from "../../components/SelectionModal";
import { UseActivityHarvest, UseActivityHarvestDatabase } from "../../database/useActivityHarvestDatabase";
import { useAuthSelection } from "../../context/selectionContext";
import { RecommendationDatabase, useRecommendationDatabase } from "../../database/useRecommendationDatabase";

export default function RecommendationManual() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const id                  = route.params?.id;
    const isEditing           = !!id;
    const safraIdFromAnalise  = route.params?.atividade_safra_id  as number | undefined;
    const glebaIdFromAnalise  = route.params?.atividade_gleba_id  as number | undefined;
    const areaFromAnalise     = route.params?.area_aplic          as number | undefined;
    const initialItens        = route.params?.initialItens;
    const analiseSoloId       = route.params?.analise_solo_id     as number | undefined;

    const { getActivityHarvestByPropriety } = UseActivityHarvestDatabase();
    const { getRecommendationById, deleteRecommendation } = useRecommendationDatabase();

    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [editingRec, setEditingRec] = useState<RecommendationDatabase | null>(null);

    const { selectedAtividadeSafraId } = useAuthSelection();
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);
    const [data_inicio, setData_inicio] = useState<Date>(new Date());
    const [data_fim, setData_fim] = useState<Date>(new Date());

    const { selectedPropriety } = usePropriety();
    const { user } = useAuth();

    // Carrega dados da recomendação ao editar
    useEffect(() => {
        if (!isEditing) return;
        getRecommendationById(id).then((rec) => {
            if (!rec) return;
            setEditingRec(rec);
            setData_inicio(new Date(rec.data_inicio));
            setData_fim(new Date(rec.data_fim));
        });
    }, [id]);

    // Carrega lista de atividade_safras da propriedade
    useEffect(() => {
        if (!selectedPropriety) return;
        getActivityHarvestByPropriety(selectedPropriety.id).then((result) => {
            if (result) setAtividadeSafra(result);
        });
    }, [selectedPropriety]);

    // Pré-seleciona safra: editar → usa rec; análise de solo → usa param; senão → usa contexto
    useEffect(() => {
        if (atividadeSafra.length === 0) return;
        if (isEditing && editingRec) {
            const safra = atividadeSafra.find(as => as.id === editingRec.atividade_safra_id) ?? null;
            setSelectedSafra(safra);
        } else if (!isEditing) {
            const targetId = safraIdFromAnalise ?? selectedAtividadeSafraId;
            if (!targetId) { setSelectedSafra(null); return; }
            const safra = atividadeSafra.find(as => as.id === targetId) ?? null;
            setSelectedSafra(safra);
        }
    }, [editingRec, atividadeSafra, selectedAtividadeSafraId, safraIdFromAnalise]);

    function handleNext() {
        if (!selectedPropriety) {
            Alert.alert("Seleção obrigatória", "Por favor, selecione uma propriedade.");
            return;
        }
        if (!selectedSafra) {
            Alert.alert("Seleção obrigatória", "Por favor, selecione uma safra.");
            return;
        }
        if (data_fim < data_inicio) {
            Alert.alert("Datas inválidas", "A data final não pode ser anterior à data de início.");
            return;
        }

        navigation.navigate('RecommendationManualGleba', {
            id: isEditing ? id : undefined,
            atividade_safra_id: selectedSafra.id,
            atividade_gleba_id: editingRec?.atividade_gleba_id ?? glebaIdFromAnalise,
            operador_id: editingRec?.operador_id,
            area_aplic: editingRec?.area_aplic ?? areaFromAnalise,
            data_inicio: data_inicio.toISOString(),
            data_fim: data_fim.toISOString(),
            recomendante_id: user?.id,
            propriedade_id: selectedPropriety.id,
            analise_solo_id: analiseSoloId,
            initialItens,
        });
    }

    function handleDeletar() {
        Alert.alert(
            'Excluir recomendação',
            'Deseja realmente excluir esta recomendação? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteRecommendation(id);
                            Alert.alert("Sucesso", "Recomendação excluída.")
                            navigation.goBack();
                        } catch {
                            Alert.alert('Erro', 'Não foi possível excluir a recomendação.');
                        }
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <TopButton title="Recomendações agrícolas"
                onCancelar={() => navigation.goBack()}
                onDeletar={isEditing ? () => handleDeletar() : undefined}
            />

            <View style={styles.form}>
                <ButtonSelect
                    title="Propriedade:"
                    text={selectedPropriety?.descricao || "Propriedade selecionada"}
                    isRequired={true}
                />

                <View style={styles.safraAtividade}>
                    <ButtonSelect
                        title="Safra:"
                        text={selectedSafra?.safra_descricao || "Selecione uma safra"}
                        isRequired={true}
                        onPress={() => setIsVisible(true)}
                    />
                </View>

                <ButtonSelect
                    title="Recomendante:"
                    text={user?.nome || "Usuário selecionado"}
                    isRequired={true}
                />

                <InputDate
                    title="Data de início:"
                    value={data_inicio}
                    onChange={setData_inicio}
                    isRequired={true}
                />

                <InputDate
                    title="Data final:"
                    value={data_fim}
                    onChange={setData_fim}
                    isRequired={true}
                />
            </View>

            <ButtonAvance title="Próximo" onSeguir={() => handleNext()} />

            <SelectionModal
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                title="Selecione a safra"
                data={atividadeSafra.map(as => ({ id: String(as.safra_id), title: as.safra_descricao }))}
                selectedId={selectedSafra ? String(selectedSafra.safra_id) : null}
                onSelect={(item) => {
                    const safra = atividadeSafra.find(as => String(as.safra_id) === item.id);
                    if (safra) setSelectedSafra(safra);
                }}
            />
        </View>
    )
}