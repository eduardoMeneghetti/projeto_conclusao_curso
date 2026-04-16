import React, { useEffect, useState } from "react";
import {
    Text,
    View
}
    from "react-native";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import ButtonLow from "../../components/ButtonLow";
import { usePrincipioAtivoDatabase, PrincipioAtivoDatabase } from "../../database/usePrincipioAtivoDatabase";
import { ListItems } from "../../components/ListItem";


export default function PrincipioAtivo() {
    const navigation = useNavigation<any>();
    const { getPrincipioAtivoAll } = usePrincipioAtivoDatabase();

    const [ principioAtivo, setPrincipioAtivo ] = useState<PrincipioAtivoDatabase[]>([]);

    useEffect(() => {
        getPrincipioAtivoAll().then((result) => {
            console.log("Principio ativo localizados : ", result, " ")
            if (result) setPrincipioAtivo(result);
        });
    }, []);

    return (
        <View style={styles.container}>
            <TopButton
                title="Princípio Ativo"
                onVoltar={
                    () => { navigation.navigate("Config") }
                }
            />

            <ListItems
                data={principioAtivo.map(a => ({
                    id: String(a.id),
                    title: a.descricao,
                    inactive: !a.ativo
                }))}
                onEdit={
                    (item) => {navigation.navigate('PrincipioAtivoForm', {id: item.id})}
                }
            />

            <ButtonLow
                onPress={
                    () => { navigation.navigate('PrincipioAtivoForm') }
                }
            />
        </View>
    );
}