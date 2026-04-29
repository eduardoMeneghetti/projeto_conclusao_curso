import { Dimensions, Platform, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 15 : 10;
const paddingHorizontal = Platform.OS === 'ios' ? screenHeight * 0.05 : screenHeight * 0.04;

export const styles = StyleSheet.create({
    top: {
        height: '20%',
        width: '100%',
        paddingTop: paddingHorizontal
    },
    title: {
        padding: '5%',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center'
    },
    botoes: {
        flexDirection: 'row',
        gap: 250,
        alignItems: 'center'
    },
    deleteRegistry: {
        color: themes.colors.red,
        fontWeight: 'bold',
    }
})