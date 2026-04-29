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
    onDeletar?: () => void;
};

export function TopButton({ title, onVoltar, onCancelar, onDeletar, ...rest }: Props) {
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

                {onDeletar && (
                    <TouchableOpacity
                        onPress={onDeletar}
                    >
                        <Text style={styles.deleteRegistry}>Deletar</Text>
                    </TouchableOpacity>
                )}

            </View>

            <Line />

            <Text style={styles.title}>{title}</Text>

        </View>
    );
}