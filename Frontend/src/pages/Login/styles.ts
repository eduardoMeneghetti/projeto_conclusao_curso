import { StyleSheet } from 'react-native';
import { themes } from "../../global/themes";

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
    title:{
        fontSize: 60,
        fontWeight: 'bold',
        marginTop: 200,
        color: themes.colors.secondary,
    },
    subTitle:{
        fontSize: 18,
        color: themes.colors.tertiary,
        marginTop: 30,
    },
    button:{
        backgroundColor: themes.colors.secondary,
        borderRadius: 10,
        width: 180,
        height: 50, 
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    buttonText:{
        color: themes.colors.tertiary,
    }
});
