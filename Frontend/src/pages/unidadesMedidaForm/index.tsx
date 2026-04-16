import React, { useEffect, useState } from "react";
import {
    Alert,
    View
} from "react-native";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUnidadesMedida } from "../../database/useUnidadesMedida";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";

export function UnidadesMedidaForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { createUnidadeMedida, getUnidadesMedida, getUnidadesMedidaById, updateUnidadeMedida } = useUnidadesMedida();

    const id = route.params?.id;
    const isEditing = !!id;

    const [descricao, setDescricao] = useState('');
    const [sigla, setSigla] = useState('');
    const [ativo, setAtivo] = useState(true);

    useEffect(() => {
        if (isEditing) {
            getUnidadesMedidaById(id).then((unidadesMedida) => {
                console.log('Unidade de medida localizada: ', unidadesMedida);
                if (unidadesMedida) {
                    setDescricao(unidadesMedida.descricao)
                    setSigla(unidadesMedida.sigla)
                    setAtivo(unidadesMedida.ativo)
                }
            });
        }
    }, [id])

    function validateSigla(value: String) {
        if (value.length > 3) {
            return {valid: false}
        }
    }

    async function handleSalvar() {
        if (!descricao) return Alert.alert("Atenção", "Descrição obrigatória");
        if (!sigla) return Alert.alert("Anteção", "Sigla obrigatória");
        const siglaValida = await validateSigla(sigla);

        if(siglaValida) return Alert.alert("Atenção", "Sigla deve ter no máximo 3 caracteres");

        if (!isEditing) {
            console.log("criando registro");

            try {
                const result = await createUnidadeMedida({
                    descricao,
                    sigla
                });

                console.log("Registro cadastrado, ", result)

            } catch (error) {
                console.log("Erro ao criar cadastro", error)
                return;
            }
        } else {
            console.log("Editando registro");

            try {
                const result = await updateUnidadeMedida({
                    id: Number(id),
                    descricao,
                    sigla,
                    ativo
                });

                console.log("Usuário editado com sucesso!, ", result)

            } catch (error) {
                console.log("Erro ao editar cadastro", error)
                return
            }
        }

        navigation.navigate('UnidadesMedida');

    }


    return (
        <View style={styles.container}>
            <TopButton
                title={isEditing ? "Edição de unidade medida" : "Cadastro de Unidade medida"}
                onVoltar={
                    () => { navigation.navigate('UnidadesMedida') }
                }
            />

            <View style={styles.form}>
                <InputText
                    title="Descrição:"
                    isRequired={true}
                    value={descricao}
                    onChangeText={setDescricao}
                />

                <InputText
                    title="Sigla"
                    isRequired={true}
                    value={sigla}
                    onChangeText={setSigla}
                />

                <ButtonSelect
                    isRequired={true}
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
    );
}