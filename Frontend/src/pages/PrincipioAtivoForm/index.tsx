import React, { useEffect, useState } from "react";
import {
    Alert,
    View
} from "react-native";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";
import { usePrincipioAtivoDatabase } from "../../database/usePrincipioAtivoDatabase";

export function PrincipioAtivoForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { createPrincipioAtivo, getPrincipioAtivo, getPrincipioAtivoById, updatePrincipioAtivo } = usePrincipioAtivoDatabase();

    const id = route.params?.id;
    const isEditing = !!id;

    const [descricao, setDescricao] = useState('');
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        if (isEditing) {
            getPrincipioAtivoById(id).then((principioAtivo) => {
                console.log('Principio ativo localizado: ', principioAtivo);
                if (principioAtivo) {
                    setDescricao(principioAtivo.descricao)
                    setAtivo(principioAtivo.ativo)
                }
            });
        }
    }, [id]);

    async function handleSalvar() {
        if (!descricao) return Alert.alert("Atenção", "Descrição obrigatória")

        if (isEditing) {
            console.log('Editando principio ativo')

            try {
                
                const result = await updatePrincipioAtivo({
                    id: Number(id),
                    descricao,
                    ativo
                })

                console.log("Principio ativo alterado com sucesso!", result)

            } catch (error) {
                console.error("Erro ao editar principio ativo: ", error)
                return
            }


        } else {
            console.log('Cadastrando novo principio ativo')

            try {
                const result = await createPrincipioAtivo({
                    descricao
                })

                console.log('Principio ativo cadastrado com Sucesso!', result)

            } catch (error) {
                console.error('Erro ao atualizar principio ativo', error)
                return
            }
        }

        navigation.navigate('PrincipioAtivo')
    }

    return (
        <View style={styles.container}>
            <TopButton
                title={isEditing ? "Edição de Princípio ativo" : "Cadastro de Princípio Ativo"}
                onVoltar={
                    () => { navigation.navigate('PrincipioAtivo') }
                }
            />

            <View style={styles.form}>

                <InputText
                    title="Descrição"
                    isRequired={true}
                    value={descricao}
                    onChangeText={setDescricao}
                />

                <ButtonSelect
                    title="Cadastro ativo:"
                    isRequired={true}
                    text={isEditing ? (ativo ? 'Sim' : 'Não') : 'Sim'}
                    onPress={isEditing ? () => setAtivo(!ativo) : undefined}
                />

            </View>

            <Button
                title="Salvar"
                onPress={handleSalvar}
            />

        </View>
    );
}