import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

export const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: themes.colors.menuBar,
        borderRadius: 16,
        padding: 16,
        width: '90%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: themes.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: themes.colors.black,
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 22,
        color: themes.colors.gray,
        fontWeight: '300',
    },
    empty: {
        textAlign: 'center',
        color: themes.colors.gray,
        marginVertical: 24,
        fontSize: 14,
    },
    card: {
        backgroundColor: themes.colors.white,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderLeftWidth: 4,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    gleba: {
        fontSize: 15,
        fontWeight: 'bold',
        color: themes.colors.black,
        flex: 1,
        marginRight: 8,
    },
    badge: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: themes.colors.white,
    },
    safra: {
        fontSize: 13,
        color: themes.colors.secondary,
        fontWeight: '600',
        marginBottom: 4,
    },
    periodo: {
        fontSize: 12,
        color: themes.colors.gray,
        marginBottom: 4,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recomendante: {
        fontSize: 12,
        color: themes.colors.gray,
    },
    totalItens: {
        fontSize: 12,
        color: themes.colors.primary,
        fontWeight: '600',
    },
});