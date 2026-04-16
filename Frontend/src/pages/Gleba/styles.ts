import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themes.colors.page
    },
    map: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        backgroundColor: themes.colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        gap: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: themes.colors.red,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteText: {
        color: themes.colors.white,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themes.colors.white,
        borderRadius: 8,
    },
});