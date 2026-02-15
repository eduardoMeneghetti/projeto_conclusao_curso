import {
    Dimensions,
    Platform,
    StyleSheet
} from "react-native";
import { themes } from "../../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 15 : 10;
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
        height: screenHeight * 0.20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: paddingVertical,
    },
    userImage: { 
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: themes.colors.primary,
        borderWidth: 4,
        marginBottom: 10,
    }
});
