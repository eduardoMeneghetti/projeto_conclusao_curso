import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: `100%`,
        height: '100%',
        backgroundColor: themes.colors.page
    },
    form: {
        alignItems: 'flex-start',
        paddingHorizontal: '5%',
        paddingTop: 16,
        gap: 16,
        width: '100%'
    },

    // Seção nutrientes
    nutrientesSection: {
        marginTop: 24,
        marginHorizontal: '5%',
        marginBottom: 16,
    },
    nutrientesTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: themes.colors.black,
        marginBottom: 10,
    },
    nutrienteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themes.colors.white,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    nutrienteDescricao: {
        fontSize: 14,
        fontWeight: '500',
        color: themes.colors.black,
    },
    nutrientePercentual: {
        fontSize: 12,
        color: themes.colors.gray,
        marginTop: 2,
    },
    removeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: themes.colors.red,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeText: {
        color: themes.colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyText: {
        color: themes.colors.gray,
        fontSize: 13,
        textAlign: 'center',
        paddingVertical: 12,
    },
    addNutrienteButton: {
        marginTop: 8,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: themes.colors.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    addNutrienteText: {
        color: themes.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },

    // Modal
    modalContainer: {
        backgroundColor: themes.colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        gap: 12,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: themes.colors.black,
        marginBottom: 4,
    },
    selecionarNutriente: {
        backgroundColor: themes.colors.background_input,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    selecionarNutrienteText: {
        fontSize: 14,
        color: themes.colors.black,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: themes.colors.gray,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: themes.colors.gray,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: themes.colors.primary,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: themes.colors.white,
        fontWeight: '600',
    },
})