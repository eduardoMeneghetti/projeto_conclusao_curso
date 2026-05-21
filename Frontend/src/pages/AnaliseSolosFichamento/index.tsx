import React, { useState } from "react";
import {
    View,
    Alert
} from 'react-native'
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import ButtonAvance from "../../components/ButtonAvance";
import { InputText } from "../../components/TextInput";
import useFichamentoDatabase from "../../database/useFichamentoDatabase";

export default function AnaliseSolosFichamento() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosAnaliseSolo = route.params;

    const { classificarParametro } = useFichamentoDatabase();

    const [argila, setArgila] = useState('');
    const [materialOrganico, setMaterialOrganico] = useState('');
    const [ctc, setCtc] = useState('');

    async function handleSalvar() {
        if (!argila || !materialOrganico || !ctc) {
            Alert.alert('Atenção', 'Todos os parâmetros são obrigatórios');
            return;
        }

        const valorArgila = Number(argila.replace(',', '.'));
        const valorMO     = Number(materialOrganico.replace(',', '.'));
        const valorCTC    = Number(ctc.replace(',', '.'));

        const classeArgila = await classificarParametro(1, valorArgila);
        const classeMO     = await classificarParametro(2, valorMO);
        const classeCTC    = await classificarParametro(3, valorCTC);

        navigation.navigate('AnaliseNPK', {
            ...dadosAnaliseSolo,
            classeArgila,
            classeMO,
            classeCTC,
            argila,
            materialOrganico,
            ctc,
        });
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Informe os resultados da analise"
                onCancelar={
                    () => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })
                }
            />

            <View style={styles.form}>

                <InputText
                    title="Argila: "
                    placeholder="Digite o valor da Argila"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={argila}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setArgila(text);
                    }}
                />

                <InputText
                    title="Máterial Orgânico: "
                    placeholder="Digite o valor do Máterial Orgânico"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={materialOrganico}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setMaterialOrganico(text);
                    }}
                />

                <InputText
                    title="CTC: "
                    placeholder="Digite o valor do CTC"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={ctc}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setCtc(text);
                    }}
                />


            </View>

            <ButtonAvance
                title="Próximo"
                onVoltar={() => navigation.goBack()}
                onSeguir={() => handleSalvar()}
            />
        </View>
    )
}

