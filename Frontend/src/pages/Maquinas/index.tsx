import React, { useEffect, useState } from "react";
import {
    View,
    Text
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import { useMaquinasDatabase , useMaquinas } from "../../database/useMaquinasDatabase";
import { ListItems } from "../../components/ListItem";
import ButtonLow from "../../components/ButtonLow";

export default function Maquinas() {
    const navigation = useNavigation<any>();

    const { getMaquinasAll } = useMaquinasDatabase();

    const [maquinas, setMaquinas] = useState<useMaquinas[]>([]);

    useEffect(() => {
        getMaquinasAll().then((result) => {
            console.log("Maquinas localizadas: ", result, " ")
            if (result) setMaquinas(result);
        })
    }, [])

    return (
        <View style={styles.container}>
            <TopButton
                title="Máquinas"
                onVoltar={
                    () => navigation.navigate('Config')
                }
            />

            <ListItems
                data={maquinas.map(m => ({
                    id: String(m.id),
                    title: m.descricao,
                    inactive: !m.ativo
                }))}
                onEdit={
                    (item) => {
                        navigation.navigate('MaquinasForm', {
                            id: item.id
                        })
                    }
                }
            />

            <ButtonLow
                onPress={
                    () => navigation.navigate('MaquinasForm')
                }
            />
        </View>
    );
}