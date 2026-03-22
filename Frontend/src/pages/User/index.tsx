import React, { useEffect, useState } from "react";
import {
    View,
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import { useUserDatabase, UserDatabase } from "../../database/useUserDatabase";
import { ListItems } from "../../components/ListItem";
import ButtonLow from "../../components/ButtonLow";

export default function User() {
    const navigation = useNavigation<any>();
    const { getUsersAll } = useUserDatabase();

    const [usuarios, setUsuarios] = useState<UserDatabase[]>([]);

    useEffect(() => {
        getUsersAll().then((result) => {
            console.log("Usuarios localizados : ", result, " ")
            if (result) setUsuarios(result);
        })
    }, [])

    return (
        <View style={styles.container}>
            <TopButton
                title="Usuários"
                onVoltar={
                    () => { navigation.navigate('Config') }
                }
            />

            <ListItems
                data={usuarios.map(a => ({
                    id: String(a.id),
                    title: a.nome,
                    inactive: !a.ativo
                }))}
                onEdit={
                    (item) => {navigation.navigate('UserForm', { id: item.id })}
                }
            />

            <ButtonLow
                onPress={
                    () => {navigation.navigate('UserForm')}
                }
            />
        </View>
    )
}