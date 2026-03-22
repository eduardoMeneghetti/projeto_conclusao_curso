import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 15
    },
    titleContainer: {
        justifyContent: 'space-around',
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