import {StyleSheet} from 'react-native';
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
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
        }
});