import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: themes.colors.page,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    form: {
        flex: 1,
        marginStart: '5%',
        alignItems: 'flex-start'
    },
    safraAtividade: {
        flexDirection: 'row',
        gap: 60
    },
})