import React from "react";
import { 
    View,
    TouchableHighlightProps,
    TouchableOpacity,
    Text,
    Alert
 } from "react-native";
import { styles } from "./styles";

type Props = TouchableHighlightProps & {
  title: string;
  tipo?: 'c' | 'v';
};

 export default function ButtonPages({tipo, title, onPress, ...rest}: Props) {

    function handlePress(){
        if(tipo === 'c'){
            Alert.alert(
                "Atenção",
                "Você tem certeza que deseja cancelar?",
                [
                    { text: "Não", style: "cancel" },
                    { text: "Sim", onPress: ()=> onPress?.({} as any)}
                ]
            );
            return;
        }

        onPress?.({} as any)
    }

     return (
        <TouchableOpacity 
                style={styles.button}
                {...rest}
                onPress={handlePress}
                activeOpacity={0.6}
            >
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
     );
 }