import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: themes.colors.white,
        marginHorizontal: 10,
        marginVertical: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: themes.colors.primary,
    },
    data: {
        fontSize: 16,
        color: themes.colors.gray,
    },
    observacao: {
        fontSize: 13,
        color: themes.colors.gray,
        marginVertical: 8,
        fontStyle: 'italic',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: themes.colors.page,
    },
    itemDescricao: {
        fontSize: 14,
        fontWeight: '500',
        color: themes.colors.black,
        flex: 1,
    },
    itemDetalhes: {
        fontSize: 14,
        color: themes.colors.gray,
        marginHorizontal: 8,
    },
    itemValor: {
        fontSize: 14,
        color: themes.colors.primary,
        fontWeight: '600',
    },
    entrada: {
        borderLeftWidth: 4,
        borderLeftColor: themes.colors.secondary,
        paddingLeft: 12,
    },
    saida: {
        borderLeftWidth: 4,
        borderLeftColor: themes.colors.red,
        paddingLeft: 12,
    },
    EditButton: {
        width: 20,
        height: 20
    },
    upCard: {
        flexDirection: 'row',
        alignContent: 'space-between',
        gap: 8
    }
})