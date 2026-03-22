import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Alert
} from 'react-native'
import { styles } from './styles'
import ButtonPages from "../../components/ButtonPages";
import { useNavigation, useRoute } from "@react-navigation/native";
import Line from "../../components/Line";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";
import { usePropDatabase } from "../../database/usePropDatabase";
import { useCidadeDatabase, CidadeDatabase, seedEstadosCidades } from "../../database/cityStateDatabase";
import SelectionModal from "../../components/SelectionModal";
import { TopButton } from "../../components/TopButton";

export default function Proprieties() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { createProprety, getPropretyById, update } = usePropDatabase();
    const { getCitiesStates } = useCidadeDatabase();

    const id = route.params?.id;
    const isEditing = !!id;
    const [ativo, setAtivo] = useState(true);

    const [descricao, setDescricao] = useState('');
    const [selectedCidade, setSelectedCidade] = useState<CidadeDatabase | null>(null);
    const [cidades, setCidades] = useState<CidadeDatabase[]>([]);
    const [isCidadeModalVisible, setIsCidadeModalVisible] = useState(false);

    useEffect(() => {
        getCitiesStates().then(setCidades)
    }, []);

    useEffect(() => {
        if (isEditing) {
            getPropretyById(id).then((prop) => {
                if (prop) {
                    setDescricao(prop.descricao);
                    setAtivo(prop.ativo);

                    getCitiesStates().then((cidades) => {
                        const cidade = cidades.find(c => c.id === prop.cidade_id);
                        if (cidade) setSelectedCidade(cidade);
                    });
                }
            });
        }
    }, [id]);

    async function handleSalvar() {
        if (!descricao) return alert('Descrição obrigatória');
        if (!selectedCidade) return alert('Cidade obrigatória');

        if (isEditing) {
            await update({
                id: Number(id),
                descricao,
                cidade_id: selectedCidade.id,
                ativo,
                updated_at: ""
            });
        } else {
            await createProprety({
                descricao,
                cidade_id: selectedCidade.id,
            });
        }

        navigation.navigate('Config');
    }

    return (
        <View style={styles.container}>

            <TopButton
                title={isEditing ? 'Edição de Propriedade' : 'Cadastro de Propriedade'}
                onVoltar={
                    () => { navigation.navigate('Config') }
                }
            />

            <View style={styles.form}>

                <InputText
                    isRequired={true}
                    title="Descrição:"
                    value={descricao}
                    onChangeText={setDescricao}
                />

                <ButtonSelect
                    isRequired={true}
                    title="Cidade:"
                    text={selectedCidade
                        ? `${selectedCidade.descricao} - ${selectedCidade.sigla}`
                        : "Selecione uma cidade"
                    }
                    onPress={() => setIsCidadeModalVisible(true)}
                />

                <ButtonSelect
                    isRequired={false}
                    title="Cadastro ativo:"
                    text={isEditing ? (ativo ? 'Sim' : 'Não') : 'Sim'}
                    onPress={isEditing ? () => setAtivo(!ativo) : undefined}
                />

            </View>

            <View style={styles.salve}>
                <Button
                    title="Salvar"
                    onPress={handleSalvar}
                />
            </View>

            <SelectionModal
                isVisible={isCidadeModalVisible}
                onClose={() => setIsCidadeModalVisible(false)}
                title="Selecione a Cidade"
                data={cidades.map(c => ({
                    id: String(c.id),
                    title: `${c.descricao} - ${c.sigla}`
                }))}
                selectedId={selectedCidade ? String(selectedCidade.id) : null}
                onSelect={(item) => {
                    const cidade = cidades.find(c => String(c.id) === item.id);
                    if (cidade) setSelectedCidade(cidade);
                }}
                showInactiveToggle={false}
            />

        </View>
    );
}