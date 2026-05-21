import React, { useEffect, useState } from "react";
import { Alert, View } from 'react-native';
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/core";
import { styles } from "./styles";
import ButtonSelect from "../../components/ButtonSelect";
import { InputDate } from "../../components/InputDate";
import ButtonAvance from "../../components/ButtonAvance";
import { usePropriety } from "../../context/PropContext";
import { useAuthSelection } from "../../context/selectionContext";
import { GlebasInActivityHarvest, UseActivityHarvest, UseActivityHarvestDatabase } from "../../database/useActivityHarvestDatabase";
import SelectionModal from "../../components/SelectionModal";
import { useActivityDatabase } from "../../database/useActivityDatabase";

export default function AnaliseSolos() {
    const navigation = useNavigation<any>();

    const { selectedPropriety } = usePropriety();
    const { getActivityHarvestByPropriety, getGlebasInActivityHarvest } = UseActivityHarvestDatabase();
    const { selectedAtividadeSafraId } = useAuthSelection();
    const { verificaExisteTabela } = useActivityDatabase();

    const [isSafraVisible, setIsSafraVisible] = useState(false);
    const [isGlebaVisible, setIsGlebaVisible] = useState(false);

    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);

    const [glebas, setGlebas] = useState<GlebasInActivityHarvest[]>([]);
    const [selectedGleba, setSelectedGleba] = useState<GlebasInActivityHarvest | null>(null);

    const [dataColeta, setDataColete] = useState<Date>(new Date());

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

    useEffect(() => {
        setSelectedGleba(null);
        setGlebas([]);
        if (!selectedSafra) return;
        getGlebasInActivityHarvest(selectedSafra.id).then((result) => {
            if (result) setGlebas(result);
        });
    }, [selectedSafra]);

    async function handleNext() {
        if (!selectedSafra) {
            Alert.alert("Seleção obrigatória", "Por favor, selecione uma safra.");
            return;
        }
        if (!selectedGleba) {
            Alert.alert("Seleção obrigatória", "Por favor, selecione uma gleba.");
            return;
        }

        const temTabela = await verificaExisteTabela(selectedSafra.atividade_id);
        if (!temTabela) {
            Alert.alert("Atividade não suportada", "Atividades suportadas: SOJA, MILHO, TRIGO, AVEIA BRANCA, AVEIA PRETA, CEVADA, CANOLA, FEIJÃO");
            return;
        }

        navigation.navigate('AnaliseSolosFichamento', {
            atividade_safra_id: selectedSafra.id,
            atividade_gleba_id: selectedGleba.atividade_gleba_id,
            qtd_area: selectedGleba.area_hectares,
            data_coleta: dataColeta.toISOString(),
            atividade_descricao: selectedSafra.atividade_descricao,
        });

    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Analise de solo"
                onCancelar={() => navigation.goBack()}
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

                <ButtonSelect
                    title="Gleba:"
                    text={selectedGleba
                        ? `${selectedGleba.descricao_gleba} (${selectedGleba.area_hectares.toFixed(2)} ha)`
                        : "Selecione uma gleba"}
                    isRequired={true}
                    onPress={() => setIsGlebaVisible(true)}
                />

                <InputDate
                    title="Data da coleta:"
                    isRequired={true}
                    value={dataColeta}
                    onChange={setDataColete}
                />
            </View>

            <ButtonAvance onSeguir={handleNext} />

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

            <SelectionModal
                isVisible={isGlebaVisible}
                onClose={() => setIsGlebaVisible(false)}
                title="Selecione a gleba"
                data={glebas.map(g => ({
                    id: String(g.atividade_gleba_id),
                    title: `${g.descricao_gleba} - ${g.area_hectares.toFixed(2)} ha`
                }))}
                selectedId={selectedGleba ? String(selectedGleba.atividade_gleba_id) : null}
                onSelect={(item) => {
                    const gleba = glebas.find(g => String(g.atividade_gleba_id) === item.id);
                    if (gleba) setSelectedGleba(gleba);
                }}
            />
        </View>
    );
}
