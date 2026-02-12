import {
    StyleSheet,
    Dimensions
} from "react-native";
import { themes } from "../../global/themes";


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 110, // cuidado com o tabBar
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: themes.colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabText:{
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold'
    }
});