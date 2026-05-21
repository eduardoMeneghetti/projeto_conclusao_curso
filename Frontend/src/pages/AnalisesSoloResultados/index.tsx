import React, { useMemo } from "react";
import { View, Text, ScrollView } from 'react-native';
import { styles } from "./styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TopButton } from "../../components/TopButton";
import ButtonAvance from "../../components/ButtonAvance";
import {
    calcularDoseP,
    calcularDoseK,
    calcularDoseN,
    calcularTotalArea,
    normalizarAtividade,
} from "../../util/dosesAdubacao";

export default function AnalisesSoloResultados() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dados = route.params;

    const qtdArea      = Number(dados?.qtd_area ?? 0);
    const classeP      = dados?.classeP  ?? '';
    const classeK      = dados?.classeK  ?? '';
    const classeMO     = dados?.classeMO ?? '';
    const atividade    = normalizarAtividade(dados?.atividade_descricao ?? '');

    const doseP = useMemo(() => calcularDoseP(classeP),           [classeP]);
    const doseK = useMemo(() => calcularDoseK(classeK),           [classeK]);
    const doseN = useMemo(() => calcularDoseN(classeMO, atividade), [classeMO, atividade]);

    const totalP = calcularTotalArea(doseP, qtdArea);
    const totalK = calcularTotalArea(doseK, qtdArea);
    const totalN = calcularTotalArea(doseN, qtdArea);

    return (
        <View style={styles.container}>
            <TopButton
                title="Resultado da análise"
                onCancelar={() => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })}
            />

            <ScrollView style={styles.form}>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Parâmetros do solo</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Argila</Text>
                        <Text style={styles.value}>{dados?.argila} % — {dados?.classeArgila}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Mat. Orgânico</Text>
                        <Text style={styles.value}>{dados?.materialOrganico} % — {dados?.classeMO}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CTC</Text>
                        <Text style={styles.value}>{dados?.ctc} — {dados?.classeCTC}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fósforo (P)</Text>
                        <Text style={styles.value}>{dados?.fosforo} mg/dm³ — {classeP}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Potássio (K)</Text>
                        <Text style={styles.value}>{dados?.potassio} mg/dm³ — {classeK}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Recomendação de adubação</Text>
                    <Text style={styles.value}>Área: {qtdArea.toFixed(2)} ha</Text>

                    <View style={[styles.row, { marginTop: 10 }]}>
                        <Text style={styles.label}>Fósforo (P₂O₅)</Text>
                        <Text style={styles.destaque}>{doseP} kg/ha</Text>
                    </View>
                    <View style={[styles.row, { marginBottom: 12 }]}>
                        <Text style={styles.label}>Total na área</Text>
                        <Text style={styles.value}>{totalP.toFixed(1)} kg</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Potássio (K₂O)</Text>
                        <Text style={styles.destaque}>{doseK} kg/ha</Text>
                    </View>
                    <View style={[styles.row, { marginBottom: 12 }]}>
                        <Text style={styles.label}>Total na área</Text>
                        <Text style={styles.value}>{totalK.toFixed(1)} kg</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Nitrogênio (N)</Text>
                        <Text style={styles.destaque}>{doseN} kg/ha</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total na área</Text>
                        <Text style={styles.value}>{totalN.toFixed(1)} kg</Text>
                    </View>
                </View>

            </ScrollView>

            <ButtonAvance
                title="Finalizar"
                onSeguir={() => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })}
            />
        </View>
    );
}