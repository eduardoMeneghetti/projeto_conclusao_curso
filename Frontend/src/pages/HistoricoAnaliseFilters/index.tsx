import React, { useEffect, useState } from 'react';
import {
    Alert,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import { styles } from './styles';
import { Button } from '../../components/Button';
import { usePropriety } from '../../context/PropContext';
import { useNavigation } from '@react-navigation/core';
import ButtonSelect from '../../components/ButtonSelect';
import { TopButton } from '../../components/TopButton';
import { InputDate } from '../../components/InputDate';
import { UseActivityHarvest, UseActivityHarvestDatabase } from '../../database/useActivityHarvestDatabase';
import SelectionModal from '../../components/SelectionModal';


export default function HistoricoAnaliseFilters() {
    const navigation = useNavigation<any>();

    const { selectedPropriety } = usePropriety()

    const { getActivityHarvestByPropriety } = UseActivityHarvestDatabase();

    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const [data_inicio, setData_inicio] = useState<Date | null>(null);
    const [data_fim, setData_fim] = useState<Date | null>(null);

    useEffect(() => {
        if (!selectedPropriety) return;
        getActivityHarvestByPropriety(selectedPropriety.id).then((result) => {
            if (result) setAtividadeSafra(result);
        });
    }, [selectedPropriety]);

    function handleGenerateReport() {
        if (!selectedPropriety) {
            Alert.alert('Atenção', 'Nenhuma propriedade selecionada.');
            return;
        }

        navigation.navigate('HistoricoAnaliseReport', {
            propriedade_id: selectedPropriety.id,
            data_inicio: data_inicio?.toISOString() ?? null,
            data_fim: data_fim?.toISOString() ?? null,
            safra_id: selectedSafra?.safra_id,
            Atividade_safra_id: selectedSafra?.id
        });
    }

    return (
        <View style={styles.container}>
            <TopButton
                title='Histórico de Análises de Solo'
                onVoltar={() => navigation.goBack()}
            />
            <View style={styles.form}>

                <ButtonSelect
                    title="Propriedade:"
                    text={selectedPropriety?.descricao || "Propriedade selecionada"}
                    isRequired={true}
                />

                <ButtonSelect
                    title="Safra: "
                    text={selectedSafra ? selectedSafra.safra_descricao : "Selecione a safra"}
                    isRequired={false}
                    onPress={() => setIsVisible(true)}
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
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                title="Selecione a safra"
                data={atividadeSafra.map(as => ({ id: String(as.safra_id), title: as.safra_descricao }))}
                selectedId={selectedSafra ? String(selectedSafra.safra_id) : null}
                onSelect={(item) => {
                    const safra = atividadeSafra.find(as => String(as.safra_id) === item.id);
                    if (safra) setSelectedSafra(safra);
                }}
            />
        </View>
    );
}