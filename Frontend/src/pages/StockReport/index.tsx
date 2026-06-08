import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { TopButton } from '../../components/TopButton';
import { ExtratoMovimento, UseMovEstoqueInsumos } from '../../database/useMovEstoqueInsumos';

export default function StockReport() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const {
        insumo_id,
        propriedade_id,
        insumo_descricao,
        insumo_unidade,
        data_inicio,
        data_fim,
    } = route.params;

    const { getExtratoEstoque, saldoItemById } = UseMovEstoqueInsumos();

    const [loading, setLoading] = useState(true);
    const [movimentos, setMovimentos] = useState<ExtratoMovimento[]>([]);
    const [saldoAtual, setSaldoAtual] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            const [movs, saldo] = await Promise.all([
                getExtratoEstoque(insumo_id, propriedade_id, data_inicio ?? null, data_fim ?? null),
                saldoItemById(insumo_id, propriedade_id),
            ]);
            if (!cancelled) {
                setMovimentos(movs);
                setSaldoAtual(saldo);
                setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [insumo_id, propriedade_id, data_inicio, data_fim]);

    const totalEntradas = movimentos
        .filter(m => m.quantidade > 0)
        .reduce((s, m) => s + m.quantidade, 0);
    const totalSaidas = movimentos
        .filter(m => m.quantidade < 0)
        .reduce((s, m) => s + Math.abs(m.quantidade), 0);
    const saldoPeriodo = totalEntradas - totalSaidas;

    function formatQtd(n: number): string {
        return Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatData(dateStr: string): string {
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    function formatVlr(v: number): string {
        return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function buildPeriodoLabel(): string {
        if (data_inicio && data_fim) {
            return `${new Date(data_inicio).toLocaleDateString('pt-BR')} a ${new Date(data_fim).toLocaleDateString('pt-BR')}`;
        }
        if (data_inicio) return `A partir de ${new Date(data_inicio).toLocaleDateString('pt-BR')}`;
        if (data_fim)    return `Até ${new Date(data_fim).toLocaleDateString('pt-BR')}`;
        return 'Todas as movimentações';
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Extrato de Estoque"
                onVoltar={() => navigation.goBack()}
            />

            <View style={styles.headerCard}>
                <Text style={styles.insumoNome}>Insumo: {insumo_descricao}</Text>
                <Text style={styles.saldoAtual}>
                    Saldo atual: {formatQtd(saldoAtual)} {insumo_unidade}
                </Text>
                <Text style={styles.periodoLabel}>{buildPeriodoLabel()}</Text>
            </View>

            {loading ? (
                <ActivityIndicator style={styles.loading} size="large" color="themes.colors.primary" />
            ) : (
                <>
                    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                        {movimentos.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhuma movimentação no período</Text>
                        ) : (
                            movimentos.map((mov, idx) => (
                                <View key={`${mov.tipo}_${mov.id}_${idx}`} style={styles.movCard}>
                                    <View style={styles.movRow}>
                                        <Text style={styles.movData}>{formatData(mov.data)}</Text>
                                        <Text style={[styles.movQtd, mov.quantidade > 0 ? styles.entrada : styles.saida]}>
                                            {mov.quantidade > 0 ? '+' : '-'}{formatQtd(mov.quantidade)} {insumo_unidade}
                                        </Text>
                                        {mov.valor_unitario > 0 && (
                                            <Text style={styles.movVlr}>vlr: {formatVlr(mov.valor_unitario)}</Text>
                                        )}
                                        <View style={[styles.tipoBadge, mov.tipo === 'AJUSTE' ? styles.badgeAjuste : styles.badgeAplic]}>
                                            <Text style={styles.tipoText}>{mov.tipo}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.movDesc} numberOfLines={2}>
                                        {mov.tipo === 'AJUSTE'
                                            ? (mov.descricao ?? '')
                                            : `${mov.gleba} - ${mov.safra}`}
                                    </Text>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        <View style={styles.footerRow}>
                            <Text style={styles.footerLabel}>Total de entradas:</Text>
                            <Text style={[styles.footerValue, styles.entrada]}>
                                +{formatQtd(totalEntradas)} {insumo_unidade}
                            </Text>
                        </View>
                        <View style={styles.footerRow}>
                            <Text style={styles.footerLabel}>Total de saídas:</Text>
                            <Text style={[styles.footerValue, styles.saida]}>
                                -{formatQtd(totalSaidas)} {insumo_unidade}
                            </Text>
                        </View>
                        <View style={[styles.footerRow, styles.footerSaldo]}>
                            <Text style={styles.footerLabel}>Saldo do período:</Text>
                            <Text style={[styles.footerValue, saldoPeriodo >= 0 ? styles.entrada : styles.saida]}>
                                {saldoPeriodo >= 0 ? '+' : '-'}{formatQtd(saldoPeriodo)} {insumo_unidade}
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}