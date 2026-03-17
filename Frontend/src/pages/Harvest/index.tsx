import React, { useState, useEffect } from "react";
import {
    View,
    Text,
} from "react-native"
import { styles } from "./sytles";
import ButtonPages from "../../components/ButtonPages";
import Line from "../../components/Line";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TopButton } from "../../components/TopButton";
import { InputText } from "../../components/TextInput";
import { UseHarverst, useHarverstDatabase } from "../../database/useHarverstDatabase";
import { InputDate } from "../../components/InputDate";
import { Button } from "../../components/Button";
import ButtonSelect from "../../components/ButtonSelect";




export default function Harvest() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { createHarvest, getHarvestById, updateHaverst } = useHarverstDatabase();

    const id = route.params?.id;
    const isEditing = !!id;
    const [ativo, setAtivo] = useState(true);

    const [descricao, setDescricao] = useState('');
    const [data_inicio, setDataInicio] = useState<Date | null>(null);
    const [data_final, setDataFinal] = useState<Date | null>(null);

    useEffect(() => {
        if (isEditing) {
            getHarvestById(id).then((harvest) => {
                if (harvest) {
                    setDescricao(harvest.descricao);
                    setAtivo(harvest.ativo);
                    setDataInicio(new Date(harvest.data_inicio));
                    setDataFinal(new Date(harvest.data_final));
                }
            });
        }
    }, [id]);


    async function handleSalvar() {
        if (!descricao) return alert("Descrição obrigatória")
        if (!data_inicio) return alert("Data início obrigatória")
        if (!data_final) return alert("Data final obrigatória")

        if (isEditing) {
            await updateHaverst({
                id: Number(id),
                descricao,
                data_inicio: data_inicio.toISOString().split('T')[0],
                data_final: data_final.toISOString().split('T')[0],
                ativo,
            });
        } else {
            await createHarvest({
                descricao,
                data_inicio: data_inicio.toISOString().split('T')[0],
                data_final: data_final.toISOString().split('T')[0]
            })
        }

        navigation.navigate('BottomRoutes')
    }

    return (
        <View style={styles.container}>
            <TopButton
                title={isEditing? 'Edição de Safra' : 'Cadastro de Safra'}
                onPress={
                    () => { navigation.navigate('BottomRoutes') }
                }
            />
            <View style={styles.mid}>
                <InputText
                    isRequired={true}
                    title="Nome da safra"
                    value={descricao}
                    onChangeText={setDescricao}
                />

                <InputDate
                    title="Data início"
                    isRequired={true}
                    value={data_inicio}
                    onChange={setDataInicio}
                />

                <InputDate
                    title="Data final"
                    isRequired={true}
                    value={data_final}
                    onChange={setDataFinal}
                />

                <ButtonSelect
                    isRequired={false}
                    title="Cadastro ativo:"
                    text={isEditing ? (ativo ? 'Sim' : 'Não') : 'Sim'}
                    onPress={isEditing ? () => setAtivo(!ativo) : undefined}
                />

            </View>

            <View style={styles.salvar}>
                <Button
                    title="Salvar"
                    onPress={handleSalvar}
                />
            </View>

        </View>
    );
}