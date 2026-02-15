import { Dimensions, Platform, StyleSheet } from 'react-native';
import { themes } from '../../global/themes';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 15 : 10;
const paddingHorizontal = screenWidth * 0.05; // 5% da largura da tela


export const styles = StyleSheet.create({
    button: {
        paddingLeft: paddingHorizontal,
        paddingTop: paddingVertical,
        paddingBottom: paddingVertical,
    },
    text: {
        fontWeight: 'normal'
    }
});