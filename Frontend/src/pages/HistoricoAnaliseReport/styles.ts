import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: themes.colors.page,
    },
    card: {
        backgroundColor: themes.colors.white,
        margin: 10,
        borderRadius: 8
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingStart: 10,
        paddingEnd: 10,
        paddingTop: 5
    },
    text_header: {
        fontSize:16,
        color: themes.colors.secondary
    },
    body: {
        alignItems: 'flex-start'
    },
    textEmpty: {
        textAlign: 'center',
        color: themes.colors.gray
    },
    divider: {
        height: 2,
        backgroundColor: themes.colors.page,
        marginVertical: 8,
    },
    groupLab: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingStart: 10
    },
    groupNPK: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingStart: 10
    },
    textDetail: {
        color: themes.colors.gray,
        fontSize: 16
    }, 
    divisor: {
        fontSize: 16, 
        fontWeight: 'bold'
    },
    recomend: {
        fontSize: 16,
        paddingEnd: 10,
        paddingBottom: 10,
        textAlign: 'right'
    }
})