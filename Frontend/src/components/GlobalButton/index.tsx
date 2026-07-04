import React from "react";
import { useFab } from "../../context/fabContext";
import { TouchableOpacity, Text, Alert } from "react-native";
import styles from "./styles";
import { useAuthSelection } from "../../context/selectionContext";
import { usePropriety } from "../../context/PropContext";

export const GlobalButton = () => {
    const { currentScreen, screenFabConfigs } = useFab();
    const { selectedHarvest } = useAuthSelection();
    const { selectedPropriety } = usePropriety();

    const config = currentScreen ? screenFabConfigs.get(currentScreen) ?? null : null;

    if (!config) return null;

    const handlePress = () => {
        if ((config.requiresHarvest ?? true) && !selectedHarvest) {
            Alert.alert("Atenção", "Selecione uma safra antes de continuar.");
            return;
        }
        if ((config.requiresPropriety ?? true) && !selectedPropriety) {
            Alert.alert("Atenção", "Selecione a propriedade nas configurações.");
            return;
        }
        config.action();
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.fab}>
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
    );
};
