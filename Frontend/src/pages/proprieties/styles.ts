import { Dimensions, Platform, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 15 : 10;
const paddingHorizontal = Platform.OS === 'ios' ? screenHeight * 0.05 : screenHeight * 0.04; 


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: themes.colors.page
    },
    top:{
        height: '20%',
        width: '100%',
        paddingTop: paddingHorizontal
    },
    title:{
        padding: '5%',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center'
    },
    form: {
        alignItems: 'flex-start',
        height: '60%',
        width: '100%',
        paddingLeft: '5%'
    },
    salve:{
        height: '100%',
        alignItems: 'center',
        alignContent: 'center'
    }
})