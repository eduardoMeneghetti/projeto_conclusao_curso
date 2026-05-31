import React, { useEffect, useState } from "react";
import {
    Alert,
    View
} from 'react-native';
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import ButtonAvance from "../../components/ButtonAvance";
import ButtonSelect from "../../components/ButtonSelect";
import { UseActivityHarvest, UseActivityHarvestDatabase } from "../../database/useActivityHarvestDatabase";
import { useAuthSelection } from "../../context/selectionContext";
import { usePropriety } from "../../context/PropContext";
import SelectionModal from "../../components/SelectionModal";
import { InputDate } from "../../components/InputDate";
import { UseAplicacoesDatabase } from "../../database/useAplicacoesDatabase";

export default function ApplicationNew() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const id = route.params?.id;
    const isEditing = !!id;

    const { selectedPropriety } = usePropriety();
    const { getActivityHarvestByPropriety } = UseActivityHarvestDatabase();
    const { getAplicacaoById, deleteAplicacao } = UseAplicacoesDatabase();
    const { selectedAtividadeSafraId } = useAuthSelection();

    const [data_inicio, setData_inicio] = useState<Date>(new Date());
    const [data_fim, setData_fim] = useState<Date>(new Date());
    const [editingAplicacao, setEditingAplicacao] = useState<any>(null);

    const [isSafraVisible, setIsSafraVisible] = useState(false);

    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);

    useEffect(() => {
        if(!isEditing) return;
        getAplicacaoById(id).then((aplic) => {
            if (!aplic) return;
            setEditingAplicacao(aplic);
            setData_inicio(new Date(aplic.data_inicio));
            setData_fim(new Date(aplic.data_final));
        })
    }, [id]);

    useEffect(() => {
        if (!selectedPropriety) return;
        getActivityHarvestByPropriety(selectedPropriety.id).then((result) => {
            if (result) setAtividadeSafra(result);
        });
    }, [selectedPropriety]);

    useEffect(() => {
        if (atividadeSafra.length === 0) return;
        const safraId = route.params?.atividadeSafraId ?? selectedAtividadeSafraId;
        if (!safraId) { setSelectedSafra(null); return; }
        const safra = atividadeSafra.find(as => as.id === safraId) ?? null;
        setSelectedSafra(safra);
    }, [atividadeSafra, selectedAtividadeSafraId]);

    useEffect(() => {
        if (!route.params?.data_inicio || isEditing) return;
        setData_inicio(new Date(route.params.data_inicio));
    }, [route.params?.data_inicio]);

    useEffect(() => {
        if (!route.params?.data_fim || isEditing) return;
        setData_fim(new Date(route.params.data_fim));
    }, [route.params?.data_fim]);

    function handleNext() {
        if (!selectedSafra) {
            Alert.alert("Seleção obrigatória", "Selecione uma safra para continuar.");
            return;
        }

        if(data_fim < data_inicio) {
            Alert.alert("Data inválida", "A data final não pode ser anterior à data de início.");
            return;
        }

        navigation.navigate('ApplicationNewGleba', {
            id: isEditing ? id : undefined,
            atividadeSafraId: selectedSafra.id,
            proprietyId: selectedPropriety?.id,
            data_inicio: data_inicio.toISOString(),
            data_fim: data_fim.toISOString(),
            operador_id: editingAplicacao?.operador_id ?? route.params?.operador_id,
            atividade_gleba_id: editingAplicacao?.atividade_gleba_id ?? route.params?.atividade_gleba_id,
            area_aplic: editingAplicacao?.area_aplic ?? route.params?.area_aplic,
            maquina_id: editingAplicacao?.maquina_id,
            recomendacoes_agricolas_id: route.params?.recomendacoes_agricolas_id,
            initialItens: route.params?.initialItens,
        });
    }

    function handleDeletar(){
        Alert.alert(
            'Excluir aplicação', 
            'Tem certeza que deseja excluir esta aplicação?', 
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAplicacao(editingAplicacao.id);
                            Alert.alert('Sucesso', 'Aplicação excluída com sucesso!');
                            navigation.goBack();
                        } catch (error) {
                            console.error("Erro ao excluir aplicação:", error);
                        }
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Nova aplicação"
                onCancelar={
                    () => { navigation.goBack() }
                }
                onDeletar={isEditing ? () => handleDeletar() : undefined}
            />

            <View style={styles.form}>

                <ButtonSelect
                    title="Propriedade:"
                    text={selectedPropriety?.descricao || "Selecione uma safra"}
                    isRequired={true}
                    onPress={() => setIsSafraVisible(true)}
                />


                <ButtonSelect
                    title="Safra:"
                    text={selectedSafra?.safra_descricao || "Selecione uma safra"}
                    isRequired={true}
                    onPress={() => setIsSafraVisible(true)}
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

            <SelectionModal
                isVisible={isSafraVisible}
                onClose={() => setIsSafraVisible(false)}
                title="Selecione a safra"
                data={atividadeSafra.map(as => ({ id: String(as.safra_id), title: as.safra_descricao }))}
                selectedId={selectedSafra ? String(selectedSafra.safra_id) : null}
                onSelect={(item) => {
                    const safra = atividadeSafra.find(as => String(as.safra_id) === item.id);
                    if (safra) setSelectedSafra(safra);
                }}
            />

            <ButtonAvance
                title="Avançar"
                onSeguir={
                    () => { handleNext() }
                }
            />
        </View>
    )
}