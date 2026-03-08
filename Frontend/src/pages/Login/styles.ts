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
        backgroundColor: themes.colors.primary,
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
        fontSize: width * 0.12, 
        fontWeight: 'bold',
        marginTop: width * 0.4, 
        color: themes.colors.secondary,
    },
    subTitle: {
        fontSize: width * 0.05, 
        color: themes.colors.tertiary,
        marginTop: width * 0.02, 
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
