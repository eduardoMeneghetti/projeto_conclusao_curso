import {
    Dimensions,
    Platform,
    StyleSheet
} from "react-native";
import { themes } from "../../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 10 : 15;
const paddingHorizontal = screenWidth * 0.05; // 5% da largura da tela


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.page,
        width: '100%',
        height: '100%'
    },
    topContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingTop: screenHeight * 0.05, // 5% da altura da tela
    },
    userContainer: {
        width: '100%',
        height: screenHeight * 0.15,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: paddingVertical,
    },
    menus: {
        paddingLeft: 10
    },
    bemVindo: {
        paddingBottom: 8,
        fontSize: 20,
        fontStyle: 'italic'
    },
    sair: {
        marginTop: 15,
        marginBottom: 15
    },
    iconSair: {
        width: 40,
        height: 40
    },
    subTitulo:{
        fontSize: 16,
        padding: 2
    }
});
