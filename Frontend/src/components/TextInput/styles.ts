// styles.ts
import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    title: {},
    inputRow: {
        flexDirection: 'row',      
        alignItems: 'center',
        width: '90%',
    },
    input: {
        flex: 1,                  
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.3)',
        paddingTop: 10,
    },
    required: {
        color: themes.colors.red
    },
    inputFocused: {
        borderColor: themes.colors.primary,
        borderBottomColor: themes.colors.primary
    },
    textFocused: {
        color: themes.colors.primary
    },
    eyeIcon: {
        width: 20,
        height: 20,
        marginLeft: 8,
    },
    errorMessage: {
        color: themes.colors.red,  
        fontSize: 11,
        marginTop: 4,
    }
});