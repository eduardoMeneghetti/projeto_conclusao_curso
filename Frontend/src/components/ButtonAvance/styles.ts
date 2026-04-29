import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 180,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 40,
    },
    buttonTextVoltar: {
        color: themes.colors.red,
        fontSize: 16,
    },
    buttonTextSeguir: {
        color: themes.colors.secondary,
        fontSize: 16,
    }
})