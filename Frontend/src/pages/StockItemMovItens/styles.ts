// styles.ts
import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.page,
        width: '100%',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    addButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 8,
        marginBottom: 8,
    },
    itemInfo: {
        flex: 1,
        paddingRight: 12,
    },
    itemDescricao: {
        fontSize: 15,
        fontWeight: 'bold',
        color: themes.colors.black,
        marginBottom: 4,
    },
    itemDetalhes: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.6)',
        marginTop: 2,
    },
    removeButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeText: {
        fontSize: 20,
        color: themes.colors.secondary,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: 'rgba(0,0,0,0.4)',
        marginTop: 20,
        fontSize: 14,
    },
});