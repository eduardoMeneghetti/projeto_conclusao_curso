// styles.ts
import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: themes.colors.page,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themes.colors.black,
    },
    selecionarInsumo: {
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 12,
        minHeight: 44,
        justifyContent: 'center',
        marginBottom: 12,
    },
    selecionarInsumoText: {
        color: 'rgba(0,0,0,0.5)',
        fontSize: 14,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        marginTop: 16,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: themes.colors.secondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    confirmButtonText: {
        color: themes.colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: themes.colors.red,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
    },
    cancelButtonText: {
        color: themes.colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
});