import { useNavigation, useRoute } from '@react-navigation/native';
import react, { useEffect, useState } from 'react';
import {
    View,
    Text
} from 'react-native';
import { useRecommendationDatabase } from '../../database/useRecommendationDatabase';
import { styles } from './styles';
import { TopButton } from '../../components/TopButton';

export default function RecommendationsReport() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosFiltros = route.params;

    const { getRecomendationsResumoBySafra } = useRecommendationDatabase();

    const [resumo, setResumo] = useState({
        total: 0,
        pendentes: 0,
        parciais: 0,
        atrasadas: 0,
        finalizadas: 0,
        manuais: 0,
        analises: 0,
    });

    useEffect(() => {
        let cancelled = false;

        async function carregar() {
            const rows = await getRecomendationsResumoBySafra(dadosFiltros.propriedade_id, dadosFiltros.safra_id);
            if (cancelled) return;

            const soma = (status: string) =>
                rows.filter(r => r.status === status).reduce((acc, r) => acc + r.total, 0);

            setResumo({
                total: rows.reduce((acc, r) => acc + r.total, 0),
                pendentes: soma('P'),
                parciais: soma('R'),
                atrasadas: soma('A'),
                finalizadas: soma('F'),
                manuais: rows.filter(r => r.tipo === 'MANUAL').reduce((acc, r) => acc + r.total, 0),
                analises: rows.filter(r => r.tipo === 'ANALISE').reduce((acc, r) => acc + r.total, 0),
            });
        }

        carregar();
        return () => { cancelled = true; };
    }, [dadosFiltros.propriedade_id, dadosFiltros.safra_id]);

    return (
        <View style={styles.container}>
            <TopButton
                title="Recomendações por safra - Resumido"
                onVoltar={() => navigation.goBack()}
            />

            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title_propriedade}>{dadosFiltros.propriedade_nome}</Text>
                    <Text style={styles.title_safra}>{dadosFiltros.safra_nome}</Text>
                </View>

                <Text style={styles.title}>Total de recomendações: {resumo.total}</Text>

                <View style={styles.groupStatus}>
                    <Text style={styles.pendente}>Pendentes: {resumo.pendentes}</Text>
                    <Text style={styles.parcial}>Parciais: {resumo.parciais}</Text>
                    <Text style={styles.atrasada}>Atrasadas: {resumo.atrasadas}</Text>
                    <Text style={styles.finalizada}>Finalizadas: {resumo.finalizadas}</Text>
                </View>

                <Text style={styles.title}>Por tipo: </Text>

                <View style={styles.groupTipo}>
                    <Text style={styles.analise}>Manuais: {resumo.manuais}</Text>
                    <Text style={styles.analise}>Por análise de solo: {resumo.analises}</Text>
                </View>

            </View>
        </View>
    );
}