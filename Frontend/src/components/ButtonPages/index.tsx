import React from "react";
import { 
    View,
    TouchableHighlightProps,
    TouchableOpacity,
    Text
 } from "react-native";
import { styles } from "./styles";

type Props = TouchableHighlightProps & {
  title: string;
};

 export default function ButtonPages({...rest}: Props) {
     return (
        <TouchableOpacity 
                style={styles.button}
                {...rest}
                activeOpacity={0.6}
            >
                <Text style={styles.text}>{rest.title}</Text>
            </TouchableOpacity>
     );
 }