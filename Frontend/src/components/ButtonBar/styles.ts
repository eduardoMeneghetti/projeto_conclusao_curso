import {StyleSheet} from 'react-native';
import { themes } from "../../global/themes";
import { opacity } from '@expo/ui/swift-ui/modifiers';

export const styles = StyleSheet.create({
        tabArea: {
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: themes.colors.menuBar,
        },
        tabItem: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            
        },
        image: {
            width: 50,
            height: 50
        },
        imageActive: {
            tintColor: themes.colors.primary,
        },
        text: {
            fontSize: 8,
            marginTop: 4,
        },
        textActive: {
            fontWeight: 'bold',
            color: themes.colors.primary,
        }
});