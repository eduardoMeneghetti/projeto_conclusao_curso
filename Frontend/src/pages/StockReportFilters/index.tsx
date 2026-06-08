import react, { useEffect, useState } from 'react';
import {
    Alert,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import { styles } from './styles';
import { TopButton } from '../../components/TopButton';
import { useNavigation } from '@react-navigation/native';
import ButtonSelect from '../../components/ButtonSelect';
import { Button } from '../../components/Button';
import { InputDate } from '../../components/InputDate';
import { Insumo, useInsumoDatabase } from '../../database/useInsumoDatabase';
import { usePropriety } from '../../context/PropContext';
import SelectionModal from '../../components/SelectionModal';

export default function StockReportFilters() {
    const navigation = useNavigation<any>();

    const { selectedPropriety } = usePropriety();
    const { getInsumoAtivo } = useInsumoDatabase();

    const [data_inicio, setData_inicio] = useState<Date | null>(null);
    const [data_fim, setData_fim] = useState<Date | null>(null);

    const [setModalInsumoVisible, setSetModalInsumoVisible] = useState(false);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);

    useEffect(() => {
        getInsumoAtivo().then((result) => {
            if (result) setInsumos(result);
        });
    }, []);

    function handleGenerateReport() {
        if (!selectedPropriety) {
            Alert.alert('Atenção', 'Nenhuma propriedade selecionada.');
            return;
        }
        if (!selectedInsumo) {
            Alert.alert(
                'Seleção obrigatória',
                'Por favor, selecione um insumo para gerar o relatório.'
            );
            return;
        }

        navigation.navigate('StockReport', {
            propriedade_id: selectedPropriety.id,
            insumo_id: selectedInsumo.id,
            insumo_descricao: selectedInsumo.descricao,
            insumo_unidade: selectedInsumo.unidade_sigla,
            data_inicio: data_inicio?.toISOString() ?? null,
            data_fim: data_fim?.toISOString() ?? null,
        });
    }

    return (
        <View style={styles.container}>
            <TopButton
                title='Extrato de Estoque'
                onVoltar={() => navigation.goBack()}
            />
            <View style={styles.form}>

                <ButtonSelect
                    title="Propriedade:"
                    text={selectedPropriety?.descricao || "Propriedade selecionada"}
                    isRequired={true}
                />

                <ButtonSelect
                    title='Insumo:'
                    isRequired={true}
                    text={selectedInsumo ? selectedInsumo.descricao : "Selecione um insumo"}
                    onPress={() => setSetModalInsumoVisible(true)}
                />

                <View style={styles.dateBlock}>
                    <InputDate
                        isRequired={false}
                        title="Data Inicial:"
                        value={data_inicio}
                        onChange={setData_inicio}
                    />
                    {data_inicio && (
                        <TouchableOpacity onPress={() => setData_inicio(null)}>
                            <Text style={styles.clearText}>Limpar data inicial</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.dateBlock}>
                    <InputDate
                        isRequired={false}
                        title="Data Final:"
                        value={data_fim}
                        onChange={setData_fim}
                    />
                    {data_fim && (
                        <TouchableOpacity onPress={() => setData_fim(null)}>
                            <Text style={styles.clearText}>Limpar data final</Text>
                        </TouchableOpacity>
                    )}
                </View>

            </View>

            <Button
                title='Gerar Relatório'
                onPress={() => handleGenerateReport()}
            />

            <SelectionModal
                isVisible={setModalInsumoVisible}
                onClose={() => setSetModalInsumoVisible(false)}
                title="Selecione um insumo"
                data={insumos.map(i => ({
                    id: String(i.id),
                    title: `${i.descricao} (${i.unidade_sigla})`,
                }))}
                selectedId={selectedInsumo ? String(selectedInsumo.id) : null}
                onSelect={(item) => {
                    const insumoSelecionado = insumos.find(i => String(i.id) === item.id);
                    if (insumoSelecionado) setSelectedInsumo(insumoSelecionado);
                }}
            />
        </View>
    );
}