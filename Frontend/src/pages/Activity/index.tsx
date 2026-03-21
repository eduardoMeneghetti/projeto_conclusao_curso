import React, { useEffect, useState } from "react";
import {
    View,
    Text
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import ButtonLow from "../../components/ButtonLow";
import { UseActivity, useActivityDatabase } from "../../database/useActivityDatabase";
import { ListItems } from "../../components/ListItem";

export default function Activity() {
    const navigation = useNavigation<any>();
    const { getActivityAll } = useActivityDatabase();

    const [atividades, setAtividades] = useState<UseActivity[]>([]);

    useEffect(() => {
        getActivityAll().then((result) => {
            console.log("atividades localizadas: ", result, "   ")
            if (result) setAtividades(result); 
        });
    }, []);


    return (
        <View style={styles.container}>
            <TopButton
                title="ATIVIDADES"
                onVoltar={
                    () => { navigation.navigate('Config') }
                }
            />

            <ListItems
                data={atividades.map(a => ({
                    id: String(a.id),
                    title: a.descricao,
                    inactive: !a.ativo
                }))}
                onEdit={(item) => navigation.navigate('ActivityForm', { id: item.id })}
            />

            <ButtonLow
                onPress={
                    () => {navigation.navigate('ActivityForm')}
                }
            />
        </View>
    );
}