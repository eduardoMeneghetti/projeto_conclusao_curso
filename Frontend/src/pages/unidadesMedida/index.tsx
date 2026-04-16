import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView
} from "react-native";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import { InputText } from "../../components/TextInput";
import ButtonLow from "../../components/ButtonLow";
import { useUnidadesMedida, UseUnidadesMedida } from "../../database/useUnidadesMedida";
import { ListItems } from "../../components/ListItem";

export default function UnidadesMedida() {
    const navigation = useNavigation<any>();
    const { getUnidadesMedidaAll } = useUnidadesMedida();

    const [unidadesMedida, setUnidadesMedida] = useState<UseUnidadesMedida[]>([]);

    useEffect(() => {
        getUnidadesMedidaAll().then((result) => {
            console.log("Unidades de medida localizadas : ", result, " ")
            if (result) setUnidadesMedida(result);
        });
    }, []);

    return (
        <View style={styles.container}>
            <TopButton
                title="Unidades de Medida"
                onVoltar={
                    () => { navigation.navigate("Config") }
                }
            />


            <ListItems
                data={unidadesMedida.map(a => ({
                    id: String(a.id),
                    title: a.descricao + " (" + a.sigla + ")",
                    inactive: !a.ativo
                }))}
                onEdit={
                    (item) => { navigation.navigate('UnidadesMedidaForm', { id: item.id }) }
                }
            />

            <ButtonLow
                onPress={
                    () => { navigation.navigate('UnidadesMedidaForm') }
                }
            />

        </View>
    );
}