import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native'
import { styles } from "./styles";
import ButtonPages from "../../components/ButtonPages";
import { TopButton } from "../../components/TopButton";
import { InputText } from "../../components/TextInput";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "../../components/Button";
import { UseActivity, useActivityDatabase } from "../../database/useActivityDatabase";
import ButtonSelect from "../../components/ButtonSelect";
import { ColorPicker } from "../../components/ColorPicker";


export default function ActivityForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { getActivityById, createActivity, updateActivity } = useActivityDatabase();

    const id = route.params?.id;
    const isEditing = !!id;
    const [ativo, setAtivo] = useState(true);

    const [descricao, setDescricao] = useState('');
    const [cor, setCor] = useState<string | null>(null);


    useEffect(() => {
        if (isEditing) {
            getActivityById(id).then((activity) => {
                console.log('activity encontrada para edição:', activity);
                if (activity) {
                    setDescricao(activity.descricao);
                    setCor(activity.cor);
                    setAtivo(activity.ativo);
                }
            });
        }
    }, [id])

    async function handleSave() {
        if (!descricao) return alert("Descrição obrigatória")
        if (!cor) return alert("Cor obrigatória")

        if (isEditing) {
            console.log("edicao em andamento")
            await updateActivity({
                id: Number(id),
                descricao,
                cor,
                ativo,
            })
            console.log('update concluído');
        } else {
            console.log('Criando nova atividade?');
            await createActivity({
                descricao,
                cor
            })
            console.log('Criada nova atividade');
        }

        navigation.navigate('Activity')
    }

    return (
        <View style={styles.container}>
            <TopButton
                title={isEditing? 'Edição de Atividade' : 'Cadastro de Atividade'}
                onVoltar={
                    () => { navigation.navigate('Activity') }
                }
            />

            <View style={styles.form}>
                <InputText
                    title="Nome da Ativdade"
                    value={descricao}
                    isRequired={true}
                    onChangeText={setDescricao}
                />

                <ColorPicker
                    selectedColor={cor}
                    onSelect={setCor}
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
                    onPress={handleSave}
                />
            </View>

        </View>
    )
}