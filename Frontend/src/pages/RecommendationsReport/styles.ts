import { StyleSheet } from 'react-native';
import { themes } from '../../global/themes';
import { STATUS_COLORS } from '../../util/statusRecomendacao';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: themes.colors.page,
    },
    card:{
        backgroundColor: themes.colors.white,
        margin: 16,
        borderRadius: 8,
        padding: 16,
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    groupStatus: {  
        marginTop: 12,
        marginBottom: 12,
        gap: 2,
    },
    groupTipo: {
        marginTop: 12,
        gap: 2
    },
    pendente: {
        color: STATUS_COLORS.P,
        fontSize: 16,
    },
    parcial: {
        color: STATUS_COLORS.R,
        fontSize: 16,
    },
    atrasada: {
        color: STATUS_COLORS.A,
        fontSize: 16,
    },
    finalizada: {
        color: STATUS_COLORS.F,
        fontSize: 16,
    },
    analise: {
        color: themes.colors.gray,
        fontSize: 16,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: themes.colors.gray,
        paddingBottom: 8
    },
    title_propriedade: {
        color: themes.colors.primary,
        fontSize: 16,
        fontWeight: '600'
    },
    title_safra: {
        color: themes.colors.secondary,
        fontSize: 16,
        fontWeight: '600'
    }
})