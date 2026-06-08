import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.page,
    },
    headerCard: {
        backgroundColor: themes.colors.white,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 8,
        borderRadius: 10,
        padding: 16,
        gap: 4,
    },
    insumoNome: {
        fontSize: 16,
        fontWeight: '700',
        color: themes.colors.black,
    },
    saldoAtual: {
        fontSize: 14,
        color: themes.colors.gray,
    },
    periodoLabel: {
        fontSize: 12,
        color: themes.colors.gray,
        marginTop: 2,
    },
    loading: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: themes.colors.gray,
        marginTop: 40,
        fontSize: 14,
    },
    movCard: {
        backgroundColor: themes.colors.white,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    movRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    movData: {
        fontSize: 13,
        color: themes.colors.gray,
        width: 40,
    },
    movQtd: {
        fontSize: 14,
        fontWeight: '700',
        flexShrink: 1,
    },
    entrada: {
        color: themes.colors.primary,
    },
    saida: {
        color: themes.colors.red,
    },
    movVlr: {
        fontSize: 12,
        color: themes.colors.gray,
    },
    tipoBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeAjuste: {
        backgroundColor: themes.colors.blue,
    },
    badgeAplic: {
        backgroundColor: themes.colors.brown,
    },
    tipoText: {
        color: themes.colors.white,
        fontSize: 11,
        fontWeight: '600',
    },
    movDesc: {
        fontSize: 12,
        color: themes.colors.gray,
        marginTop: 4,
        marginLeft: 46,
    },
    footer: {
        backgroundColor: themes.colors.white,
        marginHorizontal: 16,
        marginBottom: 16,
        marginTop: 4,
        borderRadius: 10,
        padding: 16,
        gap: 8,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerSaldo: {
        borderTopWidth: 1,
        borderTopColor: themes.colors.background_input,
        paddingTop: 8,
        marginTop: 2,
    },
    footerLabel: {
        fontSize: 13,
        color: themes.colors.gray,
    },
    footerValue: {
        fontSize: 14,
        fontWeight: '700',
    },
   
});