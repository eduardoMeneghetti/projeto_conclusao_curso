import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: themes.colors.white,
        borderRadius: 8,
        marginHorizontal: 8,
        marginVertical: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: '90%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    image: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: themes.colors.gray,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})