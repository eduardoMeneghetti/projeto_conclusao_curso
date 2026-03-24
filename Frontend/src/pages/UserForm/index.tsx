import React, { useEffect, useState } from "react";
import {
    View
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";
import { useUserDatabase } from "../../database/useUserDatabase";
import { isStrongPassword, isValidEmail } from "../../util/validation";

export default function UserForm() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { create, updateUsuarios, getUsersById, checkUsuarioExists, checkEmailExists } = useUserDatabase();

    const id = route.params?.id;
    const isEditing = !!id;

    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaError, setSenhaError] = useState('');
    const [confirmarSenhaError, setConfirmarSenhaError] = useState('');

    const [ativo, setAtivo] = useState(true);
    const [nome, setNomeCompleto] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [operador, setOperador] = useState(false);
    const [recomendante, setRecomendante] = useState(false);

    useEffect(() => {
        if (isEditing) {
            getUsersById(id).then((usuario) => {
                console.log('Usuario localizado: ', usuario);
                if (usuario) {
                    setNomeCompleto(usuario.nome);
                    setUsuario(usuario.usuario);
                    setSenha(usuario.senha);
                    setEmail(usuario.email);
                    setOperador(usuario.operador);
                    setRecomendante(usuario.recomendante);
                    setAtivo(usuario.ativo);
                }
            });
        }
    }, [id])

    function handleSenhaChange(value: string) {
        setSenha(value);
        const validation = isStrongPassword(value);
        setSenhaError(validation.valid ? '' : validation.message);
    }

    function handleConfirmarSenhaChange(value: string) {
        setConfirmarSenha(value);
        setConfirmarSenhaError(value !== senha ? 'Senhas não conferem' : '');
    }


    async function hendleSalvar() {
        if (!nome) return alert("Nome completo obrigatório");
        if (!usuario) return alert("Usuário obrigatório");
        if (!senha) return alert("Senha completo obrigatório");
        if (!email) return alert("E-mail completo obrigatório");
        if (!confirmarSenha) return alert('Confirmação de senha obrigatória');

        if (email && !isValidEmail(email)) {
            return alert('Email inválido');
        }

        const senhaValidation = isStrongPassword(senha);
        if (!senhaValidation.valid) {
            return alert(senhaValidation.message);
        }

        if (senha !== confirmarSenha) {
            return alert('Senhas não conferem');
        }

        const usuarioExiste = await checkUsuarioExists(usuario);
        if (usuarioExiste) return alert('Usuário já cadastrado');

        const emailExiste = await checkEmailExists(email);
        if (emailExiste) return alert('Email já cadastrado');


        if (isEditing) {
            console.log("Estamos em uma edicao")
            await updateUsuarios({
                id: Number(id),
                nome,
                usuario,
                senha,
                email,
                operador,
                recomendante,
                ativo
            })
            console.log("update realizado");
        } else {
            console.log('criando novo user');
            await create({
                nome,
                usuario,
                senha,
                email,
                operador,
                recomendante
            })
            console.log('Usuario criado com sucesso!');
        }

        navigation.navigate('User')

    }

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
                    value={nome}
                    onChangeText={setNomeCompleto}
                />

                <InputText
                    title="Usuário:"
                    isRequired={true}
                    value={usuario}
                    onChangeText={(text) => setUsuario(text.toLowerCase())} 
                />

                <InputText
                    title="E-mail:"
                    isRequired={true}
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />

                <InputText
                    title="Senha:"
                    isRequired={true}
                    value={senha}
                    onChangeText={handleSenhaChange}
                    secureTextEntry={true}
                    errorMessage={senhaError}  
                />

                <InputText
                    title="Confirmar senha:"
                    isRequired={true}
                    value={confirmarSenha}
                    onChangeText={handleConfirmarSenhaChange}
                    secureTextEntry={true}
                    errorMessage={confirmarSenhaError} 
                />

                <View style={styles.opcoes}>
                    <ButtonSelect
                        title="Operador:"
                        text={operador ? 'Sim' : 'Não'}
                        onPress={
                            () => setOperador(!operador)
                        }
                        isRequired={false}
                    />

                    <ButtonSelect
                        title="Recomendante:"
                        text={recomendante ? 'Sim' : 'Não'}
                        onPress={
                            () => setRecomendante(!recomendante)
                        }
                        isRequired={false}
                    />

                </View>

                <ButtonSelect
                    isRequired={false}
                    title="Cadastro ativo:"
                    text={isEditing ? (ativo ? 'Sim' : 'Não') : 'Sim'}
                    onPress={isEditing ? () => setAtivo(!ativo) : undefined}
                />

            </View>

            <Button
                title="Salvar"
                onPress={hendleSalvar}
            />

        </View>
    )
}