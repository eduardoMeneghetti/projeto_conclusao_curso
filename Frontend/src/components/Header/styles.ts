import { Dimensions, StyleSheet, Platform } from "react-native";
import { themes } from "../../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 15 : 10;
const paddingHorizontal = screenWidth * 0.05; // 5% da largura da tela

export default StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: themes.colors.menuBar,
        paddingVertical: paddingVertical,
        paddingHorizontal: paddingHorizontal,
        height: screenHeight * 0.12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image:{
        width: 35, 
        height: 35
    },
    selectedButton: {
        
    },
})

