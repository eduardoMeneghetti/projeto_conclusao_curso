import React, { useEffect, useState } from "react";
import {
    Button,
    View,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native';
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { InputDate } from "../../components/InputDate";
import ButtonAvance from "../../components/ButtonAvance";
import { TipoEntradaSaida, tipoMovimento } from "../../util/tipoMov";
import { useAuth } from "../../context/AuthContext";
import { usePropriety } from "../../context/PropContext";
import { useAjusteEstoqueDatabase } from "../../database/useAjusteEstoqueDatabase";
import { ButtonRemove } from "../../components/ButtonRemove";
import { UseMovEstoqueInsumos } from "../../database/useMovEstoqueInsumos";

export default function StockItemMov() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { user } = useAuth();
    const { selectedPropriety } = usePropriety();
    const { getMovById, updateAjuste } = useAjusteEstoqueDatabase();
    const { deleteAjusteCompleto } = UseMovEstoqueInsumos();

    const id = route.params?.id;
    const isEditing = !!id;

    const [data, setData] = useState<Date | null>(null);
    const [tipoMovimento, setTipoMovimento] = useState<TipoEntradaSaida>('E');
    const [observacao, setObservacao] = useState('');

    useEffect(() => {
        if (isEditing) {
            getMovById(id).then((ajuste) => {
                console.log('Ajuste localizado: ', ajuste);
                if (ajuste) {
                    setObservacao(ajuste.observacao);
                    setTipoMovimento(ajuste.entrada_saida);
                    setData(new Date(ajuste.data));
                }
            });
        }
    }, [id]);


    function handleSalvar() {
        if (!data) return alert('Data obrigatória');
        if (!user) return alert('Usuário não encontrado');
        if (!selectedPropriety) return alert('Selecione uma propriedade');

        if (isEditing) {
            updateAjuste({
                id: Number(id),
                data: data.toISOString().split('T')[0],
                observacao: observacao
            })

            navigation.goBack();
            
        } else {
            navigation.navigate('StockItemMovItens', {
                usuario_id: user.id,
                propriedade_id: selectedPropriety.id,
                data: data.toISOString().split('T')[0],
                observacao,
                entrada_saida: tipoMovimento,
                ajuste_id: id
            });
        }

    }

    async function handleDeletar() {
        const { sucesso, motivo } = await deleteAjusteCompleto(Number(id), selectedPropriety!.id);

        if (!sucesso) {
            Alert.alert('Não é possível deletar', motivo);
            return;
        }

        Alert.alert('Sucesso', 'Movimentação deletada!');
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Movimentação de estoque"
                onVoltar={
                    () => {
                        navigation.goBack();
                    }
                }
                onDeletar={isEditing ? () => handleDeletar() : undefined}

            />

            <View style={styles.form}>

                <View style={styles.topoForm}>
                    <ButtonSelect
                        title="Usuário:"
                        text={user?.nome ?? 'Usuario não indentificado'}
                        isRequired={true}
                    />

                    <ButtonSelect
                        title="Propriedade:"
                        text={selectedPropriety?.descricao ?? 'Nenhuma propriedade selecionada'}
                        isRequired={true}
                    />
                </View>

                <ButtonSelect
                    title="Tipo de movimento:"
                    disabled={isEditing}
                    isRequired={true}
                    text={isEditing ? tipoMovimento == 'E' ? 'Entrada' : 'Saida'
                        : tipoMovimento === 'E' ? 'Entrada' : 'Saída'}
                    onPress={() => setTipoMovimento(prev => prev === 'E' ? 'S' : 'E')}
                />


                <InputDate
                    isRequired={true}
                    title="Data do ajuste:"
                    value={data}
                    onChange={setData}
                />

                <InputText
                    title="Observação:"
                    isRequired={false}
                    value={observacao}
                    onChangeText={setObservacao}
                />

            </View>

            <ButtonAvance
                title={isEditing ? "Salvar" : "Próximo"}
                onSeguir={handleSalvar}
            />

        </View>
    )
}