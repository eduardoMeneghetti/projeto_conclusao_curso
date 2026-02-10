import { Dimensions, StyleSheet, Platform } from "react-native";
import { themes } from "../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 70 : 30;
const paddingHorizontal = screenWidth * 0.05; // 5% da largura da tela

export const stylesContainer = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        alignContent: 'center',
        textAlign: 'center',
    },

    item: {
        padding: 16,
        borderRadius: 10,
        backgroundColor: themes.colors.background_input,
        marginBottom: 12,
    },

    itemSelected: {
        backgroundColor: themes.colors.secondary,
    },

    itemText: {
        fontSize: 16,
        color: themes.colors.black,
    },

    itemTextSelected: {
        color: themes.colors.white,
        fontWeight: 'bold',
    },

})

