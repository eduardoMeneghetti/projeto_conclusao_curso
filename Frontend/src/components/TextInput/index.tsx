import React, { forwardRef, useState } from "react";
import {
    View,
    TextInputProps,
    Text,
    TextInput,
    TouchableOpacity,
    Image
} from "react-native";
import { styles } from "./styles";

type Props = TextInputProps & {
    title: string;
    isRequired?: boolean;
    errorMessage?: string; 
}

export const InputText = forwardRef<TextInput, Props>((
    { title, isRequired, errorMessage, secureTextEntry, ...props },
    ref
) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);  

    const isPassword = secureTextEntry;  

    return (
        <View style={styles.container}>
            <Text style={[
                styles.title,
                isFocused && styles.textFocused
            ]}>
                {title}
                {isRequired && <Text style={styles.required}> *</Text>}
            </Text>

            <View style={styles.inputRow}> 
                <TextInput
                    ref={ref}
                    style={[
                        styles.input,
                        isFocused && styles.inputFocused
                    ]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword && !isVisible}  
                    {...props}
                />

                
                {isPassword && (
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                        <Image
                            source={isVisible
                                ? require('../../assets/icon/olho_login_aberto.png')
                                : require('../../assets/icon/olho_login_fechado.png')
                            }
                            style={styles.eyeIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {errorMessage && (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
        </View>
    );
});