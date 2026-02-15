import React from "react";
import { View, 
    Text, 
    TouchableOpacity,
    TouchableHighlightProps,
    Image
} from "react-native";
import { styles } from "./styles";

type Props = TouchableHighlightProps & {
  title: string;
  text: string;
  isRequired: boolean;
};

export default function ButtonSelect({...rest}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    {rest.title}
                    {rest.isRequired && <Text style={styles.asterisk}> *</Text>}
                </Text>
            </View>
            <TouchableOpacity {...rest} style={styles.button}>
                <Image style={styles.image}
                    source={require('../../assets/icon/menu_select_verde.png')}
                />
                <Text style={styles.text}>
                    {rest.text}
                </Text>
            </TouchableOpacity>
        </View>
    );
}