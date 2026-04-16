import React from "react";
import { useFab } from "../../context/fabContext";
import {
    TouchableOpacity,
    Text,
    Alert
} from "react-native";
import styles from "./styles";
import { useAuthSelection } from "../../context/selectionContext";
import { usePropriety } from "../../context/PropContext";

export const GlobalButton = () => {
    const { action , requiresHarvest} = useFab();
    const { selectedHarvest } = useAuthSelection();
    const { selectedPropriety } = usePropriety();

    if (!action) return null;

    const handlePress = () => {
        
        if (requiresHarvest && !selectedHarvest) {
            Alert.alert(
                "Atenção",
                "Selecione uma safra antes de continuar."
            );
            return; 
        }


        if (!selectedPropriety) {
            Alert.alert(
                "Atenção",
                "Selecione a propriedade nas configurações."
            );
            return; 
        }

        action();
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.fab}>
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
    );
};