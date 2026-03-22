import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    circle: {
        width: 26,
        height: 26,
        borderRadius: 16,
        marginRight: 10,
    },
    circleSelected: {
        borderWidth: 3,
        borderColor: '#000',  // 👈 borda preta na selecionada
    },
    container: {
        height: '6%'
    }
});