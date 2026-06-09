import React, { useEffect, useState } from "react";
import {
    TouchableOpacity,
    View,
    Text,
    Alert
} from 'react-native'
import SelectionModal from "../../components/SelectionModal";
import { Button } from "../../components/Button";
import { InputDate } from "../../components/InputDate";
import ButtonSelect from "../../components/ButtonSelect";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { UseActivityHarvest, UseActivityHarvestDatabase } from "../../database/useActivityHarvestDatabase";
import { usePropriety } from "../../context/PropContext";
import { useNavigation } from "@react-navigation/native";
import { GlebaSelect, useGlebaDatabase } from "../../database/useGlebas";

export default function ConsumoInsumosGlebaFilters() {
    const navigation = useNavigation<any>();

    const { selectedPropriety } = usePropriety()

    const { getActivityHarvestByPropriety } = UseActivityHarvestDatabase();

    const { getGlebaInProprietySelect } = useGlebaDatabase();

    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const [gleba, setGleba] = useState<GlebaSelect[]>([]);
    const [selectedGleba, setSelectedGleba] = useState<GlebaSelect | null>(null);
    const [isVisibleGleba, setIsVisibleGleba] = useState(false);

    const [data_inicio, setData_inicio] = useState<Date | null>(null);
    const [data_fim, setData_fim] = useState<Date | null>(null);

    useEffect(() => {
        if(!selectedPropriety) return;
        getGlebaInProprietySelect(selectedPropriety.id).then((result) => {
            if(result) setGleba(result);
        });
    }, [selectedPropriety])

    useEffect(() => {
        if (!selectedPropriety) return;
        getActivityHarvestByPropriety(selectedPropriety.id).then((result) => {
            if (result) setAtividadeSafra(result);
        });
    }, [selectedPropriety]);

    function handleGenerateReport() {
        if (!selectedPropriety) {
            Alert.alert('Atenção', 'Nenhuma propriedade selecionada.');
            return;
        }

        navigation.navigate('ConsumoInsumosGlebaReport', {
            propriedade_id: selectedPropriety.id,
            data_inicio: data_inicio?.toISOString() ?? null,
            data_fim: data_fim?.toISOString() ?? null,
            safra_id: selectedSafra?.safra_id,
            Atividade_safra_id: selectedSafra?.id,
            gleba_id: selectedGleba?.id
        });
    }

    return (
        <View style={styles.container}>
            <TopButton
                title='Consumo de Insumos por Gleba'
                onVoltar={() => navigation.goBack()}
            />
            <View style={styles.form}>

                <ButtonSelect
                    title="Propriedade:"
                    text={selectedPropriety?.descricao || "Propriedade selecionada"}
                    isRequired={true}
                />

                <ButtonSelect
                    title="Safra: "
                    text={selectedSafra ? selectedSafra.safra_descricao : "Selecione a safra"}
                    isRequired={false}
                    onPress={() => setIsVisible(true)}
                />

                <ButtonSelect
                    title="Gleba: "
                    text={selectedGleba ? selectedGleba.descricao : "Selecione a Gleba"}
                    isRequired={false}
                    onPress={() => setIsVisibleGleba(true)}
                />


                <View style={styles.dateBlock}>
                    <InputDate
                        isRequired={false}
                        title="Data Inicial:"
                        value={data_inicio}
                        onChange={setData_inicio}
                    />
                    {data_inicio && (
                        <TouchableOpacity onPress={() => setData_inicio(null)}>
                            <Text style={styles.clearText}>Limpar data inicial</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.dateBlock}>
                    <InputDate
                        isRequired={false}
                        title="Data Final:"
                        value={data_fim}
                        onChange={setData_fim}
                    />
                    {data_fim && (
                        <TouchableOpacity onPress={() => setData_fim(null)}>
                            <Text style={styles.clearText}>Limpar data final</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </View>

            <Button
                title='Gerar Relatório'
                onPress={() => handleGenerateReport()}
            />

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

            <SelectionModal
                isVisible={isVisibleGleba}
                onClose={() => setIsVisibleGleba(false)}
                title="Selecione a gleba"
                data={gleba.map(g => ({ id: String(g.id), title: `${g.descricao} (${(g.area_hectares).toFixed(2)})` }))}
                selectedId={selectedGleba ? String(selectedGleba.id) : null}
                onSelect={(item) => {
                    const glebaSelecionada = gleba.find(as => String(as.id) === item.id);
                    if (glebaSelecionada) setSelectedGleba(glebaSelecionada);
                }}
            />
        </View>
    );
}