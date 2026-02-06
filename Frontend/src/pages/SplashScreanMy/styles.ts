import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3A7D44',
    },
    boxImage: {
        width: 160,
        height: 160,
    },
    boxTop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxMid: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxBottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#52B788',
        textAlign: 'center',
        marginTop: 10,
    },
    subTitle:{
        fontSize: 18,
        color: '#DDF3E4',
        textAlign: 'center',
        marginTop: 5,
    }
})          