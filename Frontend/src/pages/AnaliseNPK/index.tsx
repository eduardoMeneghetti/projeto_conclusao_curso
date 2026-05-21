import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, View } from 'react-native';
import ButtonAvance from "../../components/ButtonAvance";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { InputText } from "../../components/TextInput";
import { classificarP, classificarK } from "../../util/tabelasAdubacao";
import { useAnalisesSoloResultados } from "../../database/useAnalisesSoloResultados";
import { UseAnaliseSolos } from "../../database/UseAnaliseSolos";

export default function AnaliseNPK() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosAnaliseSolo = route.params;

    const argila = Number(dadosAnaliseSolo?.argila ?? 0);
    const materialOrganico = Number(dadosAnaliseSolo?.materialOrganico ?? 0);
    const ctc = Number(dadosAnaliseSolo?.ctc ?? 0);
    const { classeArgila, classeMO, classeCTC } = dadosAnaliseSolo ?? {};

    const { createAnalisesSoloResultados } = useAnalisesSoloResultados();
    const { createAnaliseSolo } = UseAnaliseSolos();

    const [fosforo, setFosforo] = useState('');
    const [potassio, setPotassio] = useState('');

    async function handleSalvar() {
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

        try {

            const AnaliseSolo = await createAnaliseSolo({
                atividade_gleba_id: dadosAnaliseSolo.atividade_gleba_id,
                atividade_safra_id: dadosAnaliseSolo.atividade_safra_id,
                data_coleta: dadosAnaliseSolo.data_coleta
            })

            if(!AnaliseSolo.insertedRowId) return console.error("Erro para gravar analise de solo", AnaliseSolo)
            const analise_solo_id = AnaliseSolo.insertedRowId


            await Promise.all([
                createAnalisesSoloResultados({ analises_solo_id: analise_solo_id, parametro_medido: classeArgila ?? '', parametro_medido_id: 1, valor: argila }),
                createAnalisesSoloResultados({ analises_solo_id: analise_solo_id, parametro_medido: classeMO ?? '', parametro_medido_id: 2, valor: materialOrganico }),
                createAnalisesSoloResultados({ analises_solo_id: analise_solo_id, parametro_medido: classeCTC ?? '', parametro_medido_id: 3, valor: ctc }),
                createAnalisesSoloResultados({ analises_solo_id: analise_solo_id, parametro_medido: classeP, parametro_medido_id: 4, valor: valorP }),
                createAnalisesSoloResultados({ analises_solo_id: analise_solo_id, parametro_medido: classeK, parametro_medido_id: 5, valor: valorK }),
            ]);

            console.log('Sucesso gravadas analise de solo e resultados!')
        } catch (error) {
            console.error('Erro ao salvar analise de solo e resultados', error)
            throw error
        }

        navigation.navigate('AnalisesSoloResultados', {
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
                onSeguir={() => handleSalvar()}
                onVoltar={() => navigation.goBack()}
            />
        </View>
    );
}