import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { themes } from "../../global/themes";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3A7D44',
    },
    boxTop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        width: '100%',
    },
    boxMid: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxBottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
         fontSize: width * 0.12, // 12% da largura da tela
        fontWeight: 'bold',
        marginTop: width * 0.4, // 10% da largura da tela
        color: themes.colors.secondary,
    },
    subTitle: {
        fontSize: width * 0.05, // 5% da largura da tela
        color: themes.colors.tertiary,
        marginTop: width * 0.02, // 2% da largura da tela
    },
    button: {
        backgroundColor: themes.colors.secondary,
        borderRadius: 10,
        width: 180,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: themes.colors.tertiary,
    }
});
