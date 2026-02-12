import React from "react";
import { useFab } from "../../context/fabContext";
import {
    TouchableOpacity,
    Text,
    Alert
} from "react-native";
import styles from "./styles";
import { useAuthSelection } from "../../context/selectionContext";


export const GlobalButton = () => {
    const { action } = useFab();
    const { selectedHarvest } = useAuthSelection();

    if (!action) return null;

    const handlePress = () => {
        // 🚨 validação
        if (!selectedHarvest) {
            Alert.alert(
                "Atenção",
                "Selecione uma safra antes de continuar."
            );
            return;
        }

        action(); // executa se estiver tudo certo
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.fab}>
            <Text style={styles.fabText}>
                +
            </Text>
        </TouchableOpacity>
    )

}