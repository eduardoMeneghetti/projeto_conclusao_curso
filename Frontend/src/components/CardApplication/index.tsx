import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import { styles } from "./styles";
import { themes } from "../../global/themes";

type AplicacaoItemLista = {
    insumo: string;
    quantidade: number;
    dose: number;
    unidade: string;
}

type Props = {
    id_aplicacao: number;
    data_inicio: string;
    data_final: string;
    area_aplic: number;
    operador: string;
    safra: string;
    gleba: string;
    recomendacoes_agricolas_id: number | null;
    itens: AplicacaoItemLista[];
    onPress?: () => void;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR');
}

export function CardApplication({ id_aplicacao, data_inicio, data_final, area_aplic, operador, safra, gleba, itens, recomendacoes_agricolas_id, onPress }: Props) {

    const tipoRecomendacao = recomendacoes_agricolas_id
        ? 'Aplicação por Recomendação'
        : 'Aplicação Manual';

    return (
        <View style={styles.card}>
            <View style={[styles.header, { borderLeftColor: themes.colors.primary }]}>
                <Text style={styles.title}>#{id_aplicacao} {tipoRecomendacao}</Text>
                <TouchableOpacity onPress={onPress}>
                    <Image
                        style={styles.editButton}
                        source={require('../../assets/icon/edit_item.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
                <Text style={styles.safra}>{safra}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}></Text>
                </View>
            </View>

            <Text style={styles.recomendacao}>
                {recomendacoes_agricolas_id ? 'Recomendação ID: ' + recomendacoes_agricolas_id : 'Sem recomendação associada'}
            </Text>

            <Text style={styles.periodo}>
                {formatDate(data_inicio)} → {formatDate(data_final)}
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