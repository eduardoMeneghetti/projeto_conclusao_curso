import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native'
import { styles } from "./styles";

type ItemMov = {
    descricao: string,
    quantidade: number,
    valor_unitario: number,
    unidade: string,
};

type Props = {
    entrada_saida: string,
    data: string,
    observacao: string,
    itens: ItemMov[],
    onPress?: () => void
};

export function MovimentacaoCard({ entrada_saida, data, observacao, itens, onPress }: Props) {
    const isEntrada = entrada_saida === 'E';

    return (
        <View style={styles.card}>
            <View style={[styles.header, isEntrada ? styles.entrada : styles.saida]}>
                <Text style={styles.tipo}>{isEntrada ? '↑ Entrada' : '↓ Saída'}</Text>
                <View style={styles.upCard}> 
                    <Text style={styles.data}>{new Date(data).toLocaleDateString('pt-BR')}</Text>
                    <TouchableOpacity
                        onPress={onPress}
                    >
                        <Image
                            style={styles.EditButton}
                            source={require('../../assets/icon/edit_item.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {observacao ? (
                <Text style={styles.observacao}>Obs: {observacao}</Text>
            ) : null}

            {itens.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemDescricao}>{item.descricao}</Text>
                    <Text style={styles.itemDetalhes}>
                        {Math.abs(item.quantidade).toLocaleString('pt-BR')} {item.unidade}
                    </Text>
                    <Text style={styles.itemValor}>
                        R$ {item.valor_unitario.toFixed(2)}
                    </Text>
                </View>
            ))}
        </View>
    );
}