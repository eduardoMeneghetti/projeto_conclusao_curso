import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: themes.colors.page
    },
    form: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: '5%',
        gap: 16,
        width: '100%'
    },
    salvar: {
        alignItems: 'center',
        paddingBottom: '20%'
    }
}) 