// components/ListItem/styles.ts
import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    itemInactive: {
        opacity: 0.4,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        color: themes.colors.black,
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.5)',
        marginTop: 2,
    },
    editButton: {
        padding: 8,
    },
    editIcon: {
        width: 20,
        height: 20,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: 'rgba(0,0,0,0.4)',
    }
});