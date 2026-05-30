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
import { GlebasInActivityHarvest, UseActivityHarvest, UseActivityHarvestDatabase } from "../../database/useActivityHarvestDatabase";
import { useAuthSelection } from "../../context/selectionContext";
import { useActivityDatabase } from "../../database/useActivityDatabase";
import { usePropriety } from "../../context/PropContext";
import SelectionModal from "../../components/SelectionModal";
import { InputDate } from "../../components/InputDate";

export default function ApplicationNew() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const { selectedPropriety } = usePropriety();
    const { getActivityHarvestByPropriety } = UseActivityHarvestDatabase();
    const { selectedAtividadeSafraId } = useAuthSelection();

    const [data_inicio, setData_inicio] = useState<Date>(new Date());
    const [data_fim, setData_fim] = useState<Date>(new Date());

    const [isSafraVisible, setIsSafraVisible] = useState(false);

    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);


    useEffect(() => {
        if (!selectedPropriety) return;
        getActivityHarvestByPropriety(selectedPropriety.id).then((result) => {
            if (result) setAtividadeSafra(result);
        });
    }, [selectedPropriety]);

    useEffect(() => {
        if (atividadeSafra.length === 0) return;
        if (!selectedAtividadeSafraId) { setSelectedSafra(null); return; }
        const safra = atividadeSafra.find(as => as.id === selectedAtividadeSafraId) ?? null;
        setSelectedSafra(safra);
    }, [atividadeSafra, selectedAtividadeSafraId]);

    function handleNext(){
        if (!selectedSafra) {
            Alert.alert("Seleção obrigatória", "Selecione uma safra para continuar.");
            return;
        }

        navigation.navigate('ApplicationNewGleba', {
            atividadeSafraId: selectedSafra.id,
            proprietyId: selectedPropriety?.id,
            data_inicio: data_inicio.toISOString(),
            data_fim: data_fim.toISOString()
        });
                
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Nova aplicação"
                onCancelar={
                    () => { navigation.goBack() }
                }
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
                    () => {handleNext()}
                }
            />
        </View>
    )
}