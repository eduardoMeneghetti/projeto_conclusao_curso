import { StyleSheet } from 'react-native';
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themes.colors.background_page,
    },
     scroll: {
        paddingBottom: 20,
        width: '100%',
        height: '100%',
    },
});
