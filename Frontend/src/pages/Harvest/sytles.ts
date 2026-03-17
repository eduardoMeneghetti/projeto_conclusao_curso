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
        backgroundColor: themes.colors.page,
        height: '100%',
        width: '100%'
    },
    mid: {
        alignItems: "flex-start",
        paddingLeft: '5%',
        flex: 1,
        gap: 16
    },
    salvar: {
        height: '20%',
        alignItems: 'center',
        alignContent: 'center'
    }
});