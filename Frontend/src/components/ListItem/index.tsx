// components/ListItem/index.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { styles } from "./styles";

type ListItem = {
    id: string;
    title: string;
    subtitle?: string; 
    inactive?: boolean;
};

type Props = {
    data: ListItem[];
    onEdit?: (item: ListItem) => void;
    emptyMessage?: string;  
};

export function ListItems({ data, onEdit, emptyMessage = "Nenhum registro encontrado" }: Props) {

    function renderItem({ item }: { item: ListItem }) {
        return (
            <View style={[styles.item, item.inactive && styles.itemInactive]}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    {item.subtitle && (
                        <Text style={styles.subtitle}>{item.subtitle}</Text>
                    )}
                </View>

                {onEdit && (
                    <TouchableOpacity
                        onPress={() => onEdit(item)}
                        style={styles.editButton}
                    >
                        <Image
                            source={require('../../assets/icon/edit_item.png')}
                            style={styles.editIcon}
                        />
                    </TouchableOpacity>
                    
                )}
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
                <Text style={styles.emptyText}>{emptyMessage}</Text>
            }
        />
    );
}