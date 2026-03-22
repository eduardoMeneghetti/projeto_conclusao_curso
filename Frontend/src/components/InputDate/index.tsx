import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles";

type Props = {
    title: string;
    isRequired?: boolean;
    value: Date | null;
    onChange: (date: Date) => void;
};

export function InputDate({ title, isRequired, value, onChange }: Props) {
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    function handleConfirm() {
        onChange(tempDate);
        setShow(false);
    }

    function formatDate(date: Date | null) {
        if (!date) return "";
        return date.toLocaleDateString('pt-BR');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
                {isRequired && <Text style={styles.required}> *</Text>}
            </Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={formatDate(value)}
                    placeholder="dd/mm/aaaa"
                    editable={false}
                    onPressIn={() => {
                        setTempDate(value ?? new Date());
                        setShow(true);
                    }}
                />

                <TouchableOpacity onPress={() => {
                    setTempDate(value ?? new Date());
                    setShow(true);
                }}>
                    <Image
                        source={require('../../assets/icon/calendario.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>

            {show && (
                <View>
                    <View style={styles.pickerHeader}>
                        <TouchableOpacity onPress={() => setShow(false)}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.confirmText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>

                    <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display="spinner"
                        onChange={(event, selectedDate) => {
                            if (selectedDate) setTempDate(selectedDate);
                        }}
                        style={{ width: '100%' }}
                    />
                </View>
            )}

        </View>
    );
}