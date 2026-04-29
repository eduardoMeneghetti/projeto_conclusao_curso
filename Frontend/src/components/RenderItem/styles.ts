import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    componetContainer: {
        margin: 8,
        backgroundColor: themes.colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        padding: 16,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: 'rgba(0,0,0,0.4)',
    },
    itemInactive: {
        opacity: 0.4
    },
    GroupItem: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: 8,
        flex: 1,
    },
    title: {
        color: themes.colors.primary,
        fontWeight: 'bold',
        fontSize: 16
    },
    subTitle: {
        fontWeight: '500',
        fontSize: 14,
        color: themes.colors.gray,
    },
    GroupEdit: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80
    },
    lineSaldoEdit: {
        marginTop: 4,
    },
    ItemSaldo: {
        fontSize: 12,
        fontWeight: '600',
        color: themes.colors.primary,
        gap: 5
    },
    saldoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: themes.colors.black,
    },
    editIcon: {
        width: 20,
        height: 20
    },
    GroupEditSaldo: {
        flexDirection: 'row',
        gap: 15
    }
})