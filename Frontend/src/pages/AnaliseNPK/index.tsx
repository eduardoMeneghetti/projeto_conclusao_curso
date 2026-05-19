import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, View } from 'react-native';
import ButtonAvance from "../../components/ButtonAvance";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { InputText } from "../../components/TextInput";
import { classificarP, classificarK } from "../../util/tabelasAdubacao";

export default function AnaliseNPK() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosAnaliseSolo = route.params;

    const argila = Number(dadosAnaliseSolo?.argila ?? 0);
    const ctc    = Number(dadosAnaliseSolo?.ctc    ?? 0);

    const [fosforo, setFosforo]   = useState('');
    const [potassio, setPotassio] = useState('');

    function handleSalvar() {
        if (!fosforo || !potassio) {
            Alert.alert("Atenção", "Informe os valores de Fósforo e Potássio.");
            return;
        }

        const valorP = parseFloat(fosforo.replace(',', '.'));
        const valorK = parseFloat(potassio.replace(',', '.'));

        if (isNaN(valorP) || isNaN(valorK)) {
            Alert.alert("Atenção", "Valores inválidos.");
            return;
        }

        const classeP = classificarP(valorP, argila);
        const classeK = classificarK(valorK, ctc);

        navigation.navigate('AnaliseSolosResultado', {
            ...dadosAnaliseSolo,
            fosforo: valorP,
            potassio: valorK,
            classeP,
            classeK,
        });
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Informe o F. K."
                onCancelar={() => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })}
            />

            <View style={styles.form}>
                <InputText
                    title="Fósforo (P):"
                    placeholder="Digite o valor do Fósforo (P)"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={fosforo}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setFosforo(text);
                    }}
                />

                <InputText
                    title="Potássio (K):"
                    placeholder="Digite o valor do Potássio (K)"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={potassio}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setPotassio(text);
                    }}
                />
            </View>

            <ButtonAvance
                title="Próximo"
                onSeguir={handleSalvar}
                onVoltar={() => navigation.goBack()}
            />
        </View>
    );
}