import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles';
import { RecomendacaoImportItem, useRecommendationDatabase } from '../../database/useRecommendationDatabase';
import { getStatusColor, getStatusLabel } from '../../util/statusRecomendacao';

type Props = {
    isVisible: boolean;
    onClose: () => void;
    propriedadeId: number;
    onSelect: (rec: RecomendacaoImportItem) => void;
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR');
}

export function RecommendationImportModal({ isVisible, onClose, propriedadeId, onSelect }: Props) {
    const { getRecomendacoesListaImportacao } = useRecommendationDatabase();
    const [lista, setLista] = useState<RecomendacaoImportItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isVisible) return;
        setLoading(true);
        getRecomendacoesListaImportacao(propriedadeId)
            .then(setLista)
            .finally(() => setLoading(false));
    }, [isVisible, propriedadeId]);

    function renderItem({ item }: { item: RecomendacaoImportItem }) {
        const color = getStatusColor(item.status);
        const label = getStatusLabel(item.status);

        return (
            <TouchableOpacity
                style={[styles.card, { borderLeftColor: color }]}
                onPress={() => onSelect(item)}
                activeOpacity={0.7}
            >
                <View style={styles.cardTop}>
                    <Text style={styles.gleba} numberOfLines={1}>{item.gleba}</Text>
                    <View style={[styles.badge, { backgroundColor: color }]}>
                        <Text style={styles.badgeText}>{label}</Text>
                    </View>
                </View>

                <Text style={styles.safra}>{item.safra}</Text>

                <Text style={styles.periodo}>
                    {formatDate(item.data_inicio)} → {formatDate(item.data_fim)} · {Number(item.area_aplic).toFixed(1)} ha
                </Text>

                <View style={styles.cardBottom}>
                    <Text style={styles.recomendante}>Recomendante: {item.recomendante}</Text>
                    <Text style={styles.totalItens}>{item.total_itens} insumo{item.total_itens !== 1 ? 's' : ''}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <Modal
            isVisible={isVisible}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            style={styles.modal}
            propagateSwipe
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Importar recomendação</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator color="#3A7D44" style={{ marginVertical: 24 }} />
                ) : lista.length === 0 ? (
                    <Text style={styles.empty}>Nenhuma recomendação pendente encontrada</Text>
                ) : (
                    <FlatList
                        data={lista}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </Modal>
    );
}