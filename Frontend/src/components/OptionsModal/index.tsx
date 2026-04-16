import React from "react";
import {
    Modal,
    TouchableOpacity,
    View,
    Text,
    Image
} from 'react-native';
import { styles } from "./styles";

type Option = {
    label: string;
    icon?: any;
    onPress: () => void;
}

type Props = {
    visible: boolean,
    onClose: () => void;
    title?: String,
    options: Option[];
}

export default function OptionsModal({ visible, onClose, title, options }: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.container}>
                    {title && <Text style={styles.title}>{title}</Text>}

                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                index < options.length - 1 && styles.optionBorder 
                            ]}
                            onPress={() => {
                                onClose();
                                option.onPress();
                            }}
                        >
                            {option.icon && (
                                <Image source={option.icon} style={styles.icon} />
                            )}
                            <Text style={styles.optionText}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.botaoCancel}
                    >
                        <Text style={styles.Bcancel}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}