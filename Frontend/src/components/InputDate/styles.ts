// InputDate/styles.ts
import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        width: '90%',
    },
    title: {
        fontSize: 14,
    },
    required: {
        color: themes.colors.red
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.3)',
        paddingTop: 10,
    },
    input: {
        flex: 1,
    },
    icon: {
        width: 20,
        height: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',  
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    pickerContainer: {
        backgroundColor: themes.colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 30,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    cancelText: {
        color: themes.colors.red,
        fontSize: 16,
    },
    confirmText: {
        color: themes.colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});