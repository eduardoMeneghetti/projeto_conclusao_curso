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

                <View style={styles.GroupItem}>
                    <View>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>

                    <View>
                        <Text style={styles.subTitle}>{item.subTitle}</Text>
                    </View>
                </View>

                <View style={styles.GroupEditSaldo}>
                    <View style={styles.GroupEdit}>
                        <Text style={styles.ItemSaldo}>Saldo</Text>
                        <Text style={styles.saldoValue}>{item.saldo?.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}  {item.unidade}</Text>
                    </View>
                    <View style={styles.lineSaldoEdit}>
                        {onEdit && (
                            <TouchableOpacity
                                onPress={() => onEdit(item)}
                            >
                                <Image
                                    source={require('../../assets/icon/edit_item.png')}
                                    style={styles.editIcon}
                                />
                            </TouchableOpacity>

                        )}
                    </View>

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