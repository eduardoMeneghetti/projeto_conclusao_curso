import React, { forwardRef, useState } from "react";
import {
    View,
    TextInputProps,
    Text,
    TextInput,
} from "react-native";
import { styles } from "./styles";

type Props = TextInputProps & {
    title: string;
    isRequired?: boolean;  
}

export const InputText = forwardRef<TextInput, Props>((
    { title, isRequired, ...props },  
    ref
) => {
    const [isFocused, setIsFocused] = useState(false);

    return(
        <View style={styles.container}>
            <Text style={[
                styles.title,
                isFocused && styles.textFocused
            ]}>
                {title}
                {isRequired && <Text style={styles.required}> *</Text>}  
            </Text>
            <TextInput
                ref={ref}
                style={[
                    styles.input,
                    isFocused && styles.inputFocused
                ]}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)} 
                {...props}  
            />
        </View>
    );
});