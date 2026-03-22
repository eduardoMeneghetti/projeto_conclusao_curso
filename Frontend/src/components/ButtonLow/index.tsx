import React from "react";
import {
    TouchableHighlightProps,
    TouchableOpacity,
    View,
    Text
} from 'react-native'
import styles from "./styles";

type Props = TouchableHighlightProps;

export default function ButtonLow({ ...rest }: Props) {
    return (
        <TouchableOpacity
            {...rest}
            style={styles.fab}>
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
    );
}