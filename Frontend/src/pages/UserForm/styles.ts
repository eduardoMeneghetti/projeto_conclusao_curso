import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.page
    },
    form: {
        alignItems: 'flex-start',
        paddingHorizontal: '5%',
        paddingTop: 16,
        paddingBottom: 24,
        gap: 16,
        width: '100%'
    },
    opcoes: {
        flexDirection: 'row',
        gap: 16,
        width: '100%',
    },
    buttonContainer: {
        paddingHorizontal: '5%',
        paddingVertical: 12,
    }
})