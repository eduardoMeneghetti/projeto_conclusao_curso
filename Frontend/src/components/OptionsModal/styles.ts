import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: themes.colors.white,
        borderRadius: 12,
        width: '75%',
        overflow: 'hidden',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    optionBorder: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    optionText: {
        fontSize: 15,
        color: themes.colors.black,
    },
    icon: {
        width: 22,
        height: 22,
    },
    botaoCancel: {
        alignSelf: 'flex-end',
        padding: 12,
        paddingRight: 16,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.1)',
        width: '100%',
        alignItems: 'flex-end',
    },
    Bcancel: {
        color: themes.colors.red
    }
})