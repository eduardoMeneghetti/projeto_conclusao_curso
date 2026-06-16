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
        marginBottom: 20
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
        flex: 1,
    },
    confirmButton: {
        backgroundColor: themes.colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    areaText: {
        fontSize: 14,
        color: themes.colors.gray,
    },
    drawingBar: {
        position: 'absolute',
        top: 136,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    drawingText: {
        color: themes.colors.white,
        fontSize: 13,
        flex: 1,
    },
    cancelText: {
        color: themes.colors.red,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: themes.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        color: '#fff',
        fontSize: 32,
        lineHeight: 36,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    closeModalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: themes.colors.secondary
    }
});