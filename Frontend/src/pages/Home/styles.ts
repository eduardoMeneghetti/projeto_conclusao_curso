import { StyleSheet } from 'react-native';
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes.colors.primary,
    },
    map: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    drawingBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    drawingText: {
        color: themes.colors.white,
        flex: 1,
        fontSize: 13,
    },
    cancelText: {
        color: 'red',
        fontWeight: 'bold',
        marginLeft: 10,
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
    areaText: {
        color: themes.colors.secondary,
        fontSize: 13,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themes.colors.red,
        borderRadius: 8,
    },
    confirmButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        backgroundColor: themes.colors.secondary,
        borderRadius: 8,
    },
});
