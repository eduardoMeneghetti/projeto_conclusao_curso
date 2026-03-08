import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Alert
} from 'react-native'
import { styles } from './styles'
import ButtonPages from "../../components/ButtonPages";
import { useNavigation } from "@react-navigation/native";
import Line from "../../components/Line";
import { InputText } from "../../components/TextInput";
import ButtonSelect from "../../components/ButtonSelect";
import { Button } from "../../components/Button";
import { usePropDatabase } from "../../database/propDatabse";
import { useCidadeDatabase, CidadeDatabase, seedEstadosCidades } from "../../database/cityStateDatabase";
import SelectionModal from "../../components/SelectionModal";

export default function Proprieties() {
    const navigation = useNavigation<any>();
    const { createProprety } = usePropDatabase();
    const { getCitiesStates } = useCidadeDatabase();

    const [descricao, setDescricao] = useState('');
    const [ selectedCidade, setSelectedCidade ] = useState<CidadeDatabase | null>(null);
    const [cidades, setCidades] = useState<CidadeDatabase[]>([]);
    const [isCidadeModalVisible, setIsCidadeModalVisible] = useState(false);

    useEffect(() => {
        getCitiesStates().then(setCidades)
    }, []);

    async function handleSalvar() {
        if (!descricao) return alert('Descrição obrigatória');
        if (!selectedCidade) return alert('Cidade obrigatória');

        await createProprety({
            descricao,
            cidade_id: selectedCidade.id,
        });

        navigation.navigate('Config');
    }

    return (
        <View style={styles.container}>

            <View style={styles.top}>
                <ButtonPages title="Voltar"
                    onPress={() => {
                        navigation.navigate('Config');
                    }}
                />

                <Line />

                <Text style={styles.title}>Cadastro de propriedades</Text>
            </View>

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
                        ? `${selectedCidade.descricao} - ${selectedCidade.descricao}`
                        : "Selecione uma cidade"
                    }
                    onPress={() => setIsCidadeModalVisible(true)}
                />

                <ButtonSelect
                    isRequired={false}
                    title="Cadastro ativo:"
                    text="Sim"
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