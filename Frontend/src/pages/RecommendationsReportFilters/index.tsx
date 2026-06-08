import React, { useEffect, useState } from 'react';
import {
    Alert,
    View
} from 'react-native';
import { styles } from './styles';
import { TopButton } from '../../components/TopButton';
import { useNavigation } from '@react-navigation/native';
import ButtonSelect from '../../components/ButtonSelect';
import { Button } from '../../components/Button';
import { usePropriety } from '../../context/PropContext';
import { UseActivityHarvest, UseActivityHarvestDatabase } from '../../database/useActivityHarvestDatabase';
import SelectionModal from '../../components/SelectionModal';

export default function RecommendationsReportFilters() {
    const navigation = useNavigation<any>();

    const { selectedPropriety } = usePropriety();
    const { getActivityHarvestByPropriety } = UseActivityHarvestDatabase();

    const [atividadeSafra, setAtividadeSafra] = useState<UseActivityHarvest[]>([]);
    const [selectedSafra, setSelectedSafra] = useState<UseActivityHarvest | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!selectedPropriety) return;
        getActivityHarvestByPropriety(selectedPropriety.id).then((result) => {
            if (result) setAtividadeSafra(result);
        });
    }, [selectedPropriety]);

    function handleNextPage() {
        if(!selectedSafra) {
            Alert.alert("Atenção", "Selecione a safra para gerar o relatório");
            return;
        }

        navigation.navigate("RecommendationsReport", {
            propriedade_id: selectedPropriety?.id,
            propriedade_nome: selectedPropriety?.descricao,
            safra_nome: selectedSafra.safra_descricao,
            safra_id: selectedSafra.safra_id
        });
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Recomendações por safra - Resumido"
                onVoltar={
                    () => navigation.goBack()
                }
            />

            <View style={styles.form}>

                <ButtonSelect
                    title="Propriedade: "
                    text={selectedPropriety ? selectedPropriety.descricao : "Selecione a propriedade"}
                    isRequired={true}
                />

                <ButtonSelect
                    title="Safra: "
                    text={selectedSafra ? selectedSafra.safra_descricao : "Selecione a safra"}
                    isRequired={true}
                    onPress={() => setIsVisible(true)}
                />
            </View>

            <Button
                title="Gerar relatório"
                onPress={handleNextPage}
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