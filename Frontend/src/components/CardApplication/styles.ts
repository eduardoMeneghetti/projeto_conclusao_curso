import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: themes.colors.white,
        marginHorizontal: 8,
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
        borderLeftWidth: 4,
        paddingLeft: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: themes.colors.primary,
    },
    editButton: {
        width: 28,
        height: 28,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    safra: {
        fontSize: 14,
        fontWeight: '600',
        color: themes.colors.secondary,
    },
    statusBadge: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: themes.colors.white,
    },
    periodo: {
        fontSize: 13,
        color: themes.colors.gray,
        marginBottom: 10,
    },
    recomendacao: {
        fontSize: 15,
        color: themes.colors.gray,
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: themes.colors.page,
        marginVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoBlock: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: themes.colors.gray,
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        color: themes.colors.black,
        fontWeight: '500'
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: themes.colors.page,
        gap: 8
    },
    itemDescricao: {
        flex: 1,
        fontSize: 13,
        fontWeight: 'bold',
        color: themes.colors.black,
    },
    itemDetalhe: {
        fontSize: 13,
        color: themes.colors.gray,
        marginHorizontal: 6
    },
    itemQtd: {
        fontSize: 13,
        color: themes.colors.primary,
        fontWeight: '600',
    },
});