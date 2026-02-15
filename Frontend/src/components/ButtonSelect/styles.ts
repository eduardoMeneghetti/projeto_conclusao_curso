import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        padding: 20,
    },
    text:{

    },
    titleContainer: {
        justifyContent: 'space-around',
    },
    title:{
        fontWeight: 'bold'
    },
    asterisk: {
        color: 'red',
        fontWeight: 'bold',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    image: {
            width: 15,
            height: 15
    },
});