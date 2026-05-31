import react, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    View
} from 'react-native';
import { styles } from './styles';
import { TopButton } from '../../components/TopButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import ButtonAvance from '../../components/ButtonAvance';
import { UserDatabase, useUserDatabase } from '../../database/useUserDatabase';
import { GlebasInActivityHarvest, UseActivityHarvestDatabase } from '../../database/useActivityHarvestDatabase';
import { useMaquinas, useMaquinasDatabase } from '../../database/useMaquinasDatabase';
import SelectionModal from '../../components/SelectionModal';
import ButtonSelect from '../../components/ButtonSelect';
import { InputText } from '../../components/TextInput';

export default function ApplicationNewGleba() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dados = route.params;

    const { getGlebasInActivityHarvest } = UseActivityHarvestDatabase();
    const { getUserOperador } = useUserDatabase();
    const { getMaquinas } = useMaquinasDatabase();

    const [isMaquinaModalVisible, setIsMaquinaModalVisible] = useState(false);
    const [maquina, setMaquina] = useState<useMaquinas[]>([]);
    const [selectedMaquina, setSelectedMaquina] = useState<useMaquinas | null>(null);

    const [isGlebaModalVisible, setisGlebaModalVisible] = useState(false);
    const [gleba, setGleba] = useState<GlebasInActivityHarvest[]>([]);
    const [selectedGleba, setSelectedGleba] = useState<GlebasInActivityHarvest | null>(null);

    const [isOperadorModal, setIsOperadorModal] = useState(false);
    const [operador, setOperador] = useState<UserDatabase[]>([]);
    const [seletectedOperador, setSelectedOperador] = useState<UserDatabase | null>(null);

    const [areaAplic, setAreaAplic] = useState(
        dados.area_aplic ? String(dados.area_aplic) : ''
    );

    useEffect(() => {
        getUserOperador().then((result) => {
            if (result) setOperador(result);
        });

        getMaquinas().then((result) => {
            if (result) setMaquina(result);
        });

        if (dados.atividadeSafraId) {
            getGlebasInActivityHarvest(dados.atividadeSafraId).then((result) => {
                if (result) setGleba(result);
            });
        }
    }, [dados.atividadeSafraId]);

    // Pré-seleciona gleba ao editar
    useEffect(() => {
        if (!dados.atividade_gleba_id || gleba.length === 0) return;
        const pre = gleba.find(g => g.atividade_gleba_id === dados.atividade_gleba_id);
        if (pre) setSelectedGleba(pre);
    }, [dados.atividade_gleba_id, gleba]);

    // Pré-seleciona operador ao editar
    useEffect(() => {
        if (!dados.operador_id || operador.length === 0) return;
        const pre = operador.find(o => o.id === dados.operador_id);
        if (pre) setSelectedOperador(pre);
    }, [dados.operador_id, operador]);

    //pré-seleciona máquina ao editar
    useEffect(() => {
        if (!dados.maquina_id || maquina.length === 0) return;
        const pre = maquina.find(m => m.id === dados.maquina_id);
        if (pre) setSelectedMaquina(pre);
    }, [dados.maquina_id, maquina]);

    function handleNext() {
        if (!selectedMaquina) {
            Alert.alert("Seleção obrigatória", "Selecione uma máquina para continuar.");
            return;
        }

        if (!seletectedOperador) {
            Alert.alert("Seleção obrigatória", "Selecione um operador para continuar.");
            return;
        }

        if (!selectedGleba) {
            Alert.alert("Seleção obrigatória", "Selecione uma gleba para continuar.");
            return;
        }

        const area = parseFloat(areaAplic.replace(',', '.'));
        if (!areaAplic || isNaN(area) || area <= 0) {
            Alert.alert("Atenção", "Informe uma área válida.");
            return;
        }

        if (area > selectedGleba.area_hectares) {
            Alert.alert("Atenção", "A área a ser aplicada não pode ser maior que a área da gleba.");
            return;
        }

        navigation.navigate('ApplicationNewItens', {
            ...dados,
            maquina_id: selectedMaquina.id,
            operador_id: seletectedOperador.id,
            atividade_gleba_id: selectedGleba.atividade_gleba_id,
            areaAplic: area
        });

    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Aplicação - Gleba"
                onCancelar={
                    () => { navigation.navigate('BottomRoutes', { screen: 'Aplicacoes' }) }
                }
            />

            <View style={styles.form}>

                <ButtonSelect
                    title="Selecione a máquina:"
                    text={selectedMaquina ? selectedMaquina.descricao : "Selecione a máquina"}
                    isRequired={true}
                    onPress={() => setIsMaquinaModalVisible(true)}
                />

                <ButtonSelect
                    title="Operador responsável:"
                    text={seletectedOperador ? seletectedOperador.nome : "Selecione o operador"}
                    isRequired={true}
                    onPress={() => setIsOperadorModal(true)}
                />

                <ButtonSelect
                    title="Gleba da recomendação:"
                    text={selectedGleba ? `${selectedGleba.descricao_gleba} (${selectedGleba.area_hectares.toFixed(2)} ha)` : "Selecione a gleba"}
                    isRequired={true}
                    onPress={() => setisGlebaModalVisible(true)}
                />

                <InputText
                    title="Area a ser aplicada (ha):"
                    placeholder="Digite a área a ser aplicada"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={areaAplic}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setAreaAplic(text);
                    }}
                />

            </View>

            <SelectionModal
                isVisible={isMaquinaModalVisible}
                onClose={() => setIsMaquinaModalVisible(false)}
                title="Selecione a máquina"
                data={maquina.map(m => ({
                    id: String(m.id),
                    title: m.descricao
                }))}
                selectedId={selectedMaquina ? String(selectedMaquina.id) : null}
                onSelect={(item) => {
                    const maquinaSelecionada = maquina.find(m => String(m.id) === item.id);
                    if (maquinaSelecionada) setSelectedMaquina(maquinaSelecionada);
                }}
            />


            <SelectionModal
                isVisible={isGlebaModalVisible}
                onClose={() => setisGlebaModalVisible(false)}
                title="Selecione a gleba"
                data={gleba.map(g => ({
                    id: String(g.atividade_gleba_id),
                    title: `${g.descricao_gleba} - ${g.area_hectares.toFixed(2)} ha`
                }))}
                selectedId={selectedGleba ? String(selectedGleba.atividade_gleba_id) : null}
                onSelect={(item) => {
                    const glebaSelecionada = gleba.find(g => String(g.atividade_gleba_id) === item.id);
                    if (glebaSelecionada) setSelectedGleba(glebaSelecionada);
                }}
            />

            <SelectionModal
                isVisible={isOperadorModal}
                onClose={() => setIsOperadorModal(false)}
                title="Selecione o operador"
                data={operador.map(o => ({ id: String(o.id), title: o.nome }))}
                selectedId={seletectedOperador ? String(seletectedOperador.id) : null}
                onSelect={(item) => {
                    const operadorSelecionado = operador.find(o => String(o.id) === item.id);
                    if (operadorSelecionado) setSelectedOperador(operadorSelecionado);
                }}
            />

            <ButtonAvance
                title="Avançar"
                onSeguir={
                    () => { handleNext() }
                }
                onVoltar={
                    () => { navigation.goBack() }
                }
            />
        </View>
    )
}