import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    View,
    Text,
} from 'react-native'
import { TopButton } from "../../components/TopButton";
import { ConsumoInsumosGleba, UseAplicacoesDatabase } from "../../database/useAplicacoesDatabase";
import { styles } from "./styles";
import { themes } from "../../global/themes";

export default function ConsumoInsumosGlebaReport() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosFiltros = route.params;

    const { getConsumoInsumosGleba } = UseAplicacoesDatabase();

    const [dados, setDados] = useState<ConsumoInsumosGleba[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function carregar() {
            setLoading(true);
            const resultado = await getConsumoInsumosGleba(
                dadosFiltros.propriedade_id,
                dadosFiltros.safra_id ?? null,
                dadosFiltros.data_inicio ?? null,
                dadosFiltros.data_fim ?? null,
                dadosFiltros.gleba_id ?? null
            );
            if (cancelled) return;
            setDados(resultado);
            setLoading(false);
        }

        carregar();
        return () => { cancelled = true; };
    }, [dadosFiltros]);

    function formatQtd(n: number): string {
        return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    return (
        <View style={styles.container}>
            <TopButton
                title='Consumo de Insumos por Gleba'
                onVoltar={() => navigation.goBack()}
            />

            {loading ? (
                <ActivityIndicator style={{ marginTop: 40 }} size="large" color={themes.colors.primary} />
            ) : dados.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.textEmpty}>Nenhuma aplicação encontrada</Text>
                </View>
            ) : (
                <FlatList
                    data={dados}
                    keyExtractor={(item) => item.gleba}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.safra}>{item.safra}</Text>
                            <View style={styles.divider} />
                            <View style={styles.header}>
                                <Text style={styles.text_header}>{item.gleba}</Text>
                                <Text style={styles.text_header}>({(item.area_gleba).toFixed(2)} ha)</Text>
                            </View>

                            <View style={styles.body}>
                                {item.itens.map((insumo, idx) => (
                                    <View key={idx} style={[styles.groupLab, { justifyContent: 'space-between', width: '100%', paddingEnd: 10 }]}>
                                        <Text style={styles.textDetail}>{insumo.insumo}: </Text>
                                        <View style={styles.groupDetail}>
                                            <Text style={styles.textDetail}>{formatQtd(insumo.total_quantidade)} {insumo.unidade_medida}</Text>
                                            <Text style={styles.textDetail}>({formatQtd(insumo.total_dose)} {insumo.unidade_medida}\ha)</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}
