import React, { useState } from "react";
import {
    View
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";

export default function UserForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const id = route.params?.id;
    const isEditing = !!id;
    const [ativo, setAtivo] = useState(true);

    return (
        <View style={styles.container}>
            <TopButton
                title="Cadastro de usuário"
                onVoltar={
                    () => { navigation.navigate('User') }
                }
            />

            <View style={styles.form}>
                <InputText
                    title="Nome Completo:"
                    isRequired={true}
                />

                <InputText
                    title="Usuário:"
                    isRequired={true}
                />

                <InputText
                    title="Senha:"
                    isRequired={true}
                />

                <InputText
                    title="E-mail:"
                    isRequired={true}
                />

                <View style={styles.opcoes}>
                    <ButtonSelect
                        title="Operador"
                        text='Sim'
                        onPress={
                            () => { }
                        }
                        isRequired={false}
                    />

                    <ButtonSelect
                        title="Recomendante"
                        text='Sim'
                        onPress={
                            () => { }
                        }
                        isRequired={false}
                    />

                </View>

                <ButtonSelect
                    title="Ativo"
                    text='Sim'
                    onPress={
                        () => { }
                    }
                    isRequired={false}
                />

            </View>

            <Button
                title="Salvar"
                onPress={
                    () => { }
                }
            />

        </View>
    )
}