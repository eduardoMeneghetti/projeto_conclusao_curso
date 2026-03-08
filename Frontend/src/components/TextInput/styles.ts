import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container:{
        width: '100%'
    },
    title:{
        
    },
    input:{
        borderBottomWidth: 0.5,
        width: '90%',
        borderBottomColor: 'rgba(0, 0, 0, 0.3)',
        paddingTop: 10,
    },
    required:{
        color: themes.colors.red
    },
    inputFocused:{
        borderColor: themes.colors.primary,
        borderBottomColor: themes.colors.primary  
    },
    textFocused:{
        color: themes.colors.primary
    }
})