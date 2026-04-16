import React from "react";
import {
    View
} from 'react-native';
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";

export default function StockItemMov() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <TopButton
                title="Movimentação de estoque"
                onVoltar={
                    () => {
                        navigation.goBack();
                    }
                }
                />
        </View>
    )
}