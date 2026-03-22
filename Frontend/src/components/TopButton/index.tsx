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
    onVoltar?: () => void;
    onCancelar?: () => void;
};

export function TopButton({ title, onVoltar, onCancelar, ...rest }: Props) {
    return (
        <View style={styles.top}>
            <View style={styles.botoes}>
                <ButtonPages
                    title="Voltar"
                    tipo="v"
                    {...rest}
                    onPress={onVoltar}
                />

                {onCancelar && (
                    <ButtonPages
                        title="Cancelar"
                        tipo="c"
                        {...rest}
                        onPress={onCancelar}
                    />
                )}

            </View>

            <Line />

            <Text style={styles.title}>{title}</Text>

        </View>
    );
}