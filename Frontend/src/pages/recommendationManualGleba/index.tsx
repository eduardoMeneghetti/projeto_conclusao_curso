import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Alert
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import ButtonSelect from "../../components/ButtonSelect";
import { InputText } from "../../components/TextInput";
import ButtonAvance from "../../components/ButtonAvance";
import SelectionModal from "../../components/SelectionModal";
import { GlebasInActivityHarvest, UseActivityHarvestDatabase } from "../../database/useActivityHarvestDatabase";
import { UserDatabase, useUserDatabase } from "../../database/useUserDatabase";

export default function RecommendationManualGleba() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosRecomend = route.params;

    const { getGlebasInActivityHarvest } = UseActivityHarvestDatabase();
    const { getUserOperador } = useUserDatabase();

    const [isGlebaModalVisible, setisGlebaModalVisible] = useState(false);
    const [gleba, setGleba] = useState<GlebasInActivityHarvest[]>([]);
    const [selectedGleba, setSelectedGleba] = useState<GlebasInActivityHarvest | null>(null);

    const [isOperadorModal, setIsOperadorModal] = useState(false);
    const [operador, setOperador] = useState<UserDatabase[]>([]);
    const [seletectedOperador, setSelectedOperador] = useState<UserDatabase | null>(null);

    const [areaAplic, setAreaAplic] = useState('');

    useEffect(() => {
        getUserOperador().then((result) => {
            if (result) setOperador(result);
        });

        if (dadosRecomend.atividade_safra_id) {
            console.log("Buscando glebas para atividade_safra_id: ", dadosRecomend.atividade_safra_id);
            getGlebasInActivityHarvest(dadosRecomend.atividade_safra_id).then((result) => {
                if (result) setGleba(result);
            });
        }
    }, [dadosRecomend.atividade_safra_id]);

    function handleNext() {
        if (!selectedGleba) {
            Alert.alert("Atenção", "Por favor, selecione uma gleba para continuar.");
            return;
        } 
        if (!seletectedOperador) {
            Alert.alert("Atenção", "Por favor, selecione um operador.");
            return;
        }

        const area = parseFloat(areaAplic.replace(',', '.'));
        if (!areaAplic || isNaN(area) || area <= 0) {
            Alert.alert("Atenção", "Informe uma área válida.");
            return;
        }

        if (area > selectedGleba.area_hectares) {
            Alert.alert("Atenção", "A área a ser aplicada não pode ser maior que a área da gleba.");
            return;
        }

        navigation.navigate('recomendationManualInsumo', {
            ...dadosRecomend,
            gleba: selectedGleba,
            operador: seletectedOperador,
            areaAplicacao: area
        });
    }

    return (
        <View style={styles.container}>
            <TopButton title="Recomendação Manual - Gleba"
                onCancelar={() => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })}
            />

            <View style={styles.form}>

                <ButtonSelect
                    title="Gleba da recomendação:"
                    text={selectedGleba ? `${selectedGleba.descricao_gleba} (${selectedGleba.area_hectares.toFixed(2)} ha)` : "Selecione a gleba"}
                    isRequired={true}
                    onPress={
                        () => setisGlebaModalVisible(true)
                    }
                />

                <ButtonSelect
                    title="Operador responsável:"
                    text={seletectedOperador ? `${seletectedOperador.nome}` : "Selecione o operador"}
                    isRequired={true}
                    onPress={
                        () => setIsOperadorModal(true)
                    }
                />

                <InputText
                    title="Area a ser aplicada (ha):"
                    placeholder="Digite a área a ser aplicada"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={areaAplic}
                    onChangeText={(text) => {
                        // aceita ponto ou vírgula como separador decimal, até 2 casas
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setAreaAplic(text);
                    }}
                />

            </View>

            <ButtonAvance
                title="Próximo"
                onSeguir={
                    () => handleNext()
                }
                onVoltar={
                    () => { navigation.goBack() }
                }
            />


            <SelectionModal
                isVisible={isGlebaModalVisible}
                onClose={() => setisGlebaModalVisible(false)}
                title="Selecione a gleba"
                data={gleba.map(g => ({
                    id: String(g.gleba_id),
                    title: `${g.descricao_gleba} - ${g.area_hectares.toFixed(2)} ha`
                }))}
                selectedId={selectedGleba ? String(selectedGleba.gleba_id) : null}
                onSelect={(item) => {
                    const glebaSelecionada = gleba.find(g => String(g.gleba_id) === item.id);
                    if (glebaSelecionada) setSelectedGleba(glebaSelecionada);
                }}
            />

            <SelectionModal
                isVisible={isOperadorModal}
                onClose={()=> setIsOperadorModal(false)}
                title="Selecione o operador"
                data={operador.map(o => ({
                    id: String(o.id),
                    title: o.nome
                }))}
                selectedId={seletectedOperador ? String(seletectedOperador.id) : null}
                onSelect={(item) => {
                    const operadorSelecionado = operador.find(o => String(o.id) === item.id);
                    if (operadorSelecionado) setSelectedOperador(operadorSelecionado);
                }}
            />

        </View>
    )
}