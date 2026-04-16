import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { styles } from "./styles";
import { FlatList } from "react-native-gesture-handler";

type RenderItemProps = {
    id: string,
    title: string;
    subTitle: string;
    saldo?: number;
    unidade?: string;
    inactive?: boolean
}

type Props = {
    data: RenderItemProps[];
    onEdit?: (item: RenderItemProps) => void;
    emptyMessage?: string;
}


export default function RenderItem({ data, onEdit, emptyMessage }: Props) {

    function renderItem({ item }: { item: RenderItemProps }) {
        return (
            <View style={[styles.componetContainer, item.inactive && styles.itemInactive]}>

                <View>
                    <Text style={styles.itemContainer}>{item.title}</Text>
                    <Text style={styles.ItemsubTitle}>{item.subTitle}</Text>
                </View>

                <View style={styles.groupSaldoEdit}>
                    <View>
                        <Text style={styles.ItemSaldo}>Saldo</Text>
                        <Text style={styles.itemContainer}>{item.saldo} {item.unidade}</Text>
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


            </View>
        )
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
    )
}