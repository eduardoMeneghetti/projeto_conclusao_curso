import React, { useEffect, useState } from "react";
import {
    Alert,
    View
} from 'react-native'
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

export default function RecommendationManual() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const id = route.params?.id;
    const isEditing = !!id;

    const { getActivityHarvestByPropriety } = UseActivityHarvestDatabase();
    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const { selectedAtividadeSafraId } = useAuthSelection();
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);
    const [ data_recomendacao, setData_recomendacao ] = useState<Date>(new Date());

    const { selectedPropriety } = usePropriety();
    const { user } = useAuth();

    useEffect(() => {
        if (!selectedPropriety) return;
        getActivityHarvestByPropriety(selectedPropriety.id).then((result) => {
            if (result) setAtividadeSafra(result);
        });
    }, [selectedPropriety]);

    useEffect(() => {
        if (atividadeSafra.length === 0) return;
        if (!selectedAtividadeSafraId) { setSelectedSafra(null); return; }
        const safraAtual = atividadeSafra.find(as => as.id === selectedAtividadeSafraId) ?? null;
        setSelectedSafra(safraAtual);
    }, [selectedAtividadeSafraId, atividadeSafra]);

    function handleNext() {
        if (!selectedPropriety) {
            Alert.alert("Seleção obrigatória", "Por favor, selecione uma propriedade.");
            return;
        }
        if (!selectedSafra) {
            Alert.alert("Seleção obrigatória", "Por favor, selecione uma safra.");
            return;
        }

        navigation.navigate('RecommendationManualGleba', {
            atividade_safra_id: selectedSafra.id,
            data_recomendacao: data_recomendacao.toISOString(),
            recomendante_id: user?.id,
            propriedade_id: selectedPropriety.id,
        });
    }

    return (

        <View style={styles.container}>
            <TopButton title="Recomendação Manual"
                onCancelar={
                    () => navigation.goBack()
                }
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
                        onPress={
                            () => setIsVisible(true)
                        }
                    />

                </View>

                <ButtonSelect
                    title="Recomendante:"
                    text={user?.nome || "Usuário selecionado"}
                    isRequired={true}
                />

                <InputDate
                    title="Data da recomendação:"
                    value={data_recomendacao}
                    onChange={setData_recomendacao}
                    isRequired={true}
                />

            </View>

            <ButtonAvance
                title="Próximo"
                onSeguir={
                    () => handleNext()
                }
            />

            <SelectionModal
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                title="Selecione a safra"
                data={atividadeSafra.map(as => ({
                    id: String(as.safra_id),
                    title: as.safra_descricao
                }))}
                selectedId={selectedSafra ? String(selectedSafra.safra_id) : null}
                onSelect={(item) => {
                    const safra = atividadeSafra.find(as => String(as.safra_id) === item.id);
                    if (safra) setSelectedSafra(safra);
                    console.log("Safra selecionada:", safra);
                }}
            />

        </View>
    )
}