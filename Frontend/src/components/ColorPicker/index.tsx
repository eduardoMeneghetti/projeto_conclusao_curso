// components/ColorPicker/index.tsx
import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { styles } from "./styles";

const CORES = [
    '#E74C3C', // vermelho
    '#E67E22', // laranja
    '#F1C40F', // amarelo
    '#2ECC71', // verde
    '#1ABC9C', // verde água
    '#3498DB', // azul
    '#9B59B6', // roxo
    '#E91E63', // rosa
    '#795548', // marrom
    '#607D8B', // cinza azulado
];

type Props = {
    selectedColor: string | null;
    onSelect: (color: string) => void;
};

export function ColorPicker({ selectedColor, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <FlatList
                data={CORES}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onSelect(item)}
                        style={[
                            styles.circle,
                            { backgroundColor: item },
                            selectedColor === item && styles.circleSelected
                        ]}
                    />
                )}
            />
        </View>
    );
}