import React, { useEffect, useState } from 'react';
import {
    Alert,
    TouchableOpacity,
    Text,
    View,
    FlatList
} from 'react-native';
import { TopButton } from '../../components/TopButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { AnaliseHistorico, UseAnaliseSolos } from '../../database/UseAnaliseSolos';


export default function HistoricoAnaliseReport() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosFiltros = route.params;

    const { getHistoricoAnaliseSolo } = UseAnaliseSolos();

    const [dados, setDados] = useState<AnaliseHistorico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function carregar() {
            setLoading(true);
            const resultado = await getHistoricoAnaliseSolo(
                dadosFiltros.propriedade_id,
                dadosFiltros.safra_id,
                dadosFiltros.data_inicio,
                dadosFiltros.data_fim
            )
            if (cancelled) return;
            setDados(resultado)
            setLoading(false);
        }

        carregar();
        return () => { cancelled = true; };
    }, [dadosFiltros])

    function formatData(dateStr: string): string {
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }


    return (
        <View style={styles.container}>
            <TopButton
                title='Histórico de Análises de Solo'
                onVoltar={
                    () => navigation.goBack()
                }
            />
            <FlatList
                data={dados}
                keyExtractor={(item) => String(item.analise_id)}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.text_header}>{formatData(item.data_coleta)}</Text>
                            <Text style={styles.text_header}>{item.gleba}</Text>
                            <Text style={styles.text_header}>{item.safra}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.body}>
                            <View style={styles.groupLab}>
                                <Text style={styles.textDetail}>Argila: {item.argila ? item.argila : '0'}%</Text>
                                <Text style={styles.divisor}>   |   </Text>
                                <Text style={styles.textDetail}>MO: {item.mo ? item.mo : '0'}%</Text>
                                <Text style={styles.divisor}>   |   </Text>
                                <Text style={styles.textDetail}>CTC: {item.ctc ? item.ctc : '0'}</Text>
                            </View>

                            <View style={styles.groupNPK}>
                                <Text style={styles.textDetail}>P: {item.fosforo ? item.fosforo : '0'} mg/dm³</Text>
                                <Text style={styles.divisor}>   |   </Text>
                                <Text style={styles.textDetail}>K: {item.potassio ? item.potassio : '0'} mg/dm³</Text>
                            </View>
                        </View>
                        <Text style={styles.recomend}>
                            {item.gerou_recomendacao === 1
                                ? `✅ Recomendação #${item.recomendacao_id} gerada`
                                : '→ Sem recomendação'}
                        </Text>
                    </View>

                )}
                ListEmptyComponent={
                    <Text style={styles.textEmpty}>Nenhuma análise encontrada</Text>
                }
            />

        </View>
    );
}