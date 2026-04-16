import { Dimensions, Platform, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Configurações de padding para diferentes plataformas e tamanhos de tela
const paddingVertical = Platform.OS === 'ios' ? 15 : 10;
const paddingHorizontal = Platform.OS === 'ios' ? screenHeight * 0.05 : screenHeight * 0.04;


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themes.colors.page,
        height: '100%',
        width: '100%'
    },
    mid: {
        alignItems: "flex-start",
        paddingLeft: '5%',
        flex: 1,
        gap: 16
    },
    salvar: {
        height: '20%',
        alignItems: 'center',
        alignContent: 'center'
    },
    InLine: {
        flexDirection: `row`,
        gap: 40
    },
    glebasList: {
        width: '100%',
        gap: 8,
    },
    glebasTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    glebaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    glebaInfo: {
        flex: 1,
    },
    glebaDescricao: {
        fontSize: 14,
    },
    glebaArea: {
        fontSize: 12,
        color: 'gray',
    },
    glebaButton: {
       padding: 8
    },
    glebaButtonAdd: {
        backgroundColor: 'green',
    },
    glebaButtonRemove: {
        backgroundColor: 'red',
    },
    glebaButtonText: {
        color: themes.colors.white,
        fontSize: 12,
    },
    scroll: {
        paddingBottom: 20
    },
    glebaButtonIcon: {
        width: 24,
        height: 24,
    },
});