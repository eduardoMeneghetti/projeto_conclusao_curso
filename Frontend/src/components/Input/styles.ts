import {StyleSheet} from 'react-native';
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    input:{
        backgroundColor: themes.colors.background_input,    
        borderRadius: 10,
        width: 300,
        height: 60,
        paddingLeft: 15,
        fontSize: 16,
        marginBottom: 40,
    },

    button:{
        backgroundColor: themes.colors.secondary,
        borderRadius: 10,
        width: 180,
        height: 50, 
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    
    buttonText:{
        color: themes.colors.tertiary,
    },

    icon: {
    position: 'absolute',
    right: 15,
    top: 22,
    alignItems: 'center',
    justifyContent: 'center',
    },

    iconImage: {
    width: 22,
    height: 22,
    }
});