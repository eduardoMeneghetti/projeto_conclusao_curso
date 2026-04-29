import React from "react";
import {
    TouchableOpacity,
    View,
    Text,
} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "./styles";

type RootStackParamList = any;
type NavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
    onVoltar?: String | (() => void);
    onSeguir?: String | (() => void);
    title?: string;
};

export default function ButtonAvance({ onVoltar, onSeguir, title }: Props) {
    const navigation = useNavigation<NavigationProp>();

    const handleVoltar = () => {
        if (typeof onVoltar === 'string') {
            navigation.navigate(onVoltar);
        } else if (typeof onVoltar === 'function') {
            onVoltar();
        } else {
            navigation.goBack();
        }
    };

    const handleSeguir = () => {
        if (typeof onSeguir === 'string') {
            navigation.navigate(onSeguir);
        } else if (typeof onSeguir === 'function') {
            onSeguir();
        }
    };

    return (
        <View style={styles.container}>
            <View>
                {onVoltar && (
                    <TouchableOpacity onPress={handleVoltar}>
                        <Text style={styles.buttonTextVoltar}>Voltar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View>
                {onSeguir && (
                    <TouchableOpacity onPress={handleSeguir}>
                        <Text style={styles.buttonTextSeguir}>{title || "Avançar"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}