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
        paddingHorizontal: '5%',
        paddingTop: 12,
    },
    card: {
        backgroundColor: themes.colors.white,
        borderRadius: 8,
        padding: 14,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.colors.primary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 14,
        color: themes.colors.black,
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        color: themes.colors.gray,
    },
    destaque: {
        fontSize: 14,
        color: themes.colors.primary,
        fontWeight: 'bold',
    },
})