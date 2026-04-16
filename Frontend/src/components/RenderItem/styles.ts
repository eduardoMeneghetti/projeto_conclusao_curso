import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes.colors.background_page,
    },
    componetContainer: {
        margin: 8,
        backgroundColor: themes.colors.page,
        flex: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    itemContainer: {
        fontSize: 16,
    },
    ItemSaldo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    ItemsubTitle: {
        fontSize: 15,
        paddingTop: 8,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: 'rgba(0,0,0,0.4)',
    },
    editButton: {
        padding: 8,
    },
    editIcon: {
        width: 20,
        height: 20,
    },
    groupSaldoEdit: {
        flexDirection: 'row',
        gap: 10
    },
    itemInactive: {
        opacity: 0.4
    }
})