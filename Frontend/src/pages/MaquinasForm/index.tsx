import React, { useEffect, useState } from "react";
import {
    Alert,
    View
} from 'react-native'
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";
import { useMaquinasDatabase } from "../../database/useMaquinasDatabase";

export default function MaquinasForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const id = route.params?.id;
    const isEditing = !!id;

    const { createMaquina, updateMaquinas, getMaquinaById } = useMaquinasDatabase();

    const [descricao, setDescricao] = useState('');
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        if (isEditing) {
            getMaquinaById(id).then((maquina) => {
                console.log('Maquinas localizadas: ', maquina)
                if (maquina) {
                    setDescricao(maquina.descricao)
                    setAtivo(maquina.ativo)
                }
            })
        }
    }, [id])

    async function handleSalvar() {
        if (!descricao) return Alert.alert('Atenção', 'Descrição é obrigatória')

        if (isEditing) {
            try {
                const result = await updateMaquinas({
                    id: Number(id),
                    descricao,
                    ativo
                })

                console.log('Sucesso ao editar', result)
            } catch (error) {
                console.error('Erro ao editar', error)
            }

        } else {
            try {
                const create = await createMaquina({
                    descricao: descricao
                })

                console.log('Sucesso ao criar', create)
            } catch (error) {
                console.error('Erro ao realizar cadastro', error)
            }
        }

        navigation.navigate('Maquinas')
    }

    return (
        <View style={styles.container}>
            <TopButton
                title={isEditing? 'Edição de máquina' : 'Cadastro de máquina'}
                onVoltar={
                    () => navigation.navigate('Maquinas')
                }
            />

            <View style={styles.form}>

                <InputText
                    title="Descrição: "
                    value={descricao}
                    onChangeText={setDescricao}
                    isRequired={true}
                />

                <ButtonSelect
                    isRequired={false}
                    title="Cadastro ativo:"
                    text={isEditing ? (ativo ? 'Sim' : 'Não') : 'Sim'}
                    onPress={isEditing ? () => setAtivo(!ativo) : undefined}
                />

            </View>

            <Button
                title="Salvar"
                onPress={handleSalvar}
            />

        </View>
    )
}