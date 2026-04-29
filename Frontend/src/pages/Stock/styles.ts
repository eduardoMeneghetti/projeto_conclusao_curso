import { StyleSheet } from 'react-native';
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
    scroll: {
        paddingBottom: 20,
        width: '100%',
        height: '100%',
    },
    componetContainer: {
        margin: 10,
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
    escolha: {
        backgroundColor: themes.colors.white,
        marginTop: 40,
        padding: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    item1: {
        width: '50%',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 1,
        borderColor: themes.colors.primary
    },
    item2: {
        width: '50%',
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 1,
        borderColor: themes.colors.primary
    },
    text: {
        fontSize: 18
    },
    abaAtiva: {
        backgroundColor: themes.colors.secondary,
    },
    textAbaAtiva: {
        color: themes.colors.white,
        fontWeight: 'bold'
    }
});
