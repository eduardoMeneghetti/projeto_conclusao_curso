import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native'
import ButtonPages from "../ButtonPages";
import Line from "../Line";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title?: string;
};

export  function TopButton({title, ...rest}: Props) {
    return (
        <View style={styles.top}>
            <ButtonPages title="Voltar"
             {...rest}
            />

            <Line />

            <Text style={styles.title}>{title}</Text>

        </View>
    );
}