import { Dimensions, StyleSheet, Platform } from "react-native";
import { themes } from "../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 70 : 30;
const paddingHorizontal = screenWidth * 0.05; // 5% da largura da tela

export const styles = StyleSheet.create({
    container: {
        height: screenHeight * 0.8,
        backgroundColor: themes.colors.menuBar,
        overflow: 'hidden',
        paddingHorizontal: paddingHorizontal,
        paddingVertical: paddingVertical,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        alignItems: 'stretch'
    }
})

