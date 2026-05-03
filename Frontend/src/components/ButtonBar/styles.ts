import {StyleSheet} from 'react-native';
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
        tabArea: {
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: themes.colors.menuBar,
        },
        tabItem: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 10,
        },
        iconContainer: {
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
        },
        image: {
            width: 40,
            height: 40
        },
        imageActive: {
            tintColor: themes.colors.primary,
        },
        text: {
            fontSize: 12,
            marginTop: 2,
            textAlign: 'center',
            lineHeight: 13,
        },
        textActive: {
            fontWeight: 'bold',
            color: themes.colors.primary,
            textAlign: 'center'
        }
});