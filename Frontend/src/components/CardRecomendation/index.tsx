import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import { StatusRecomendacao, getStatusLabel, getStatusColor } from "../../util/statusRecomendacao";
import { styles } from "./styles";

type RecomendacaoItemLista = {
    insumo: string;
    quantidade: number;
    dose: number;
    unidade: string;
}

type Props = {
    id_recomendacao: number;
    analises_solo_id: number | null;
    data_inicio: string;
    data_fim: string;
    status: StatusRecomendacao;
    area_aplic: number;
    operador: string;
    recomendante: string;
    safra: string;
    gleba: string;
    origem: string;
    itens: RecomendacaoItemLista[];
    onPress?: () => void;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR');
}

export function CardRecomendation({ data_inicio, data_fim, status, area_aplic, operador, recomendante, safra, gleba, itens, analises_solo_id, onPress }: Props) {
    const statusColor = getStatusColor(status);
    const statusLabel = getStatusLabel(status);

    const tipoRecomendacao = analises_solo_id
        ? 'Recomendação por Análise'
        : 'Recomendação Manual';

    return (
        <View style={styles.card}>
            <View style={[styles.header, { borderLeftColor: statusColor }]}>
                <Text style={styles.title}>{tipoRecomendacao}</Text>
                <TouchableOpacity onPress={onPress}>
                    <Image
                        style={styles.editButton}
                        source={require('../../assets/icon/edit_item.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
                <Text style={styles.safra}>{safra}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{statusLabel}</Text>
                </View>
            </View>

            <Text style={styles.periodo}>
                {formatDate(data_inicio)} → {formatDate(data_fim)}
            </Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Gleba</Text>
                    <Text style={styles.value}>{gleba}</Text>
                </View>
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Área aplic.</Text>
                    <Text style={styles.value}>{Number(area_aplic).toFixed(2)} ha</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Recomendante</Text>
                    <Text style={styles.value}>{recomendante}</Text>
                </View>
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Operador</Text>
                    <Text style={styles.value}>{operador}</Text>
                </View>
            </View>

            {itens?.length > 0 && (
                <>
                    <View style={styles.divider} />
                    {itens.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemDescricao}>{item.insumo}</Text>
                            <Text style={styles.itemDetalhe}>
                                {Number(item.dose).toFixed(2)} {item.unidade}/ha
                            </Text>
                            <Text style={styles.itemQtd}>
                                {Number(item.quantidade).toFixed(2)} {item.unidade}
                            </Text>
                        </View>
                    ))}
                </>
            )}
        </View>
    );
}