import react, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    Alert
} from 'react-native';
import { styles } from './styles';
import { TopButton } from '../../components/TopButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddItemForm, RecomendacaoItem } from '../../components/AddItemForm';
import ButtonAvance from '../../components/ButtonAvance';
import ButtonPages from '../../components/ButtonPages';
import { Insumo, useInsumoDatabase } from '../../database/useInsumoDatabase';
import { UseAplicacoesDatabase } from '../../database/useAplicacoesDatabase';
import { useAplicacoesItensDatabase } from '../../database/useAplicacoesItensDatabase';
import { UseMovEstoqueInsumos } from '../../database/useMovEstoqueInsumos';
import { useAjusteEstoqueDatabase } from '../../database/useAjusteEstoqueDatabase';

export default function ApplicationNewItens() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosAplic = route.params;

    const { getInsumoAtivo } = useInsumoDatabase();
    const { create } = useAjusteEstoqueDatabase();
    const { createMovInsumo, validarSaidaSemNegatacao } = UseMovEstoqueInsumos();
    const { createAplic } = UseAplicacoesDatabase();
    const { createAplicacaoItem } = useAplicacoesItensDatabase();

    const [itens, setItens] = useState<RecomendacaoItem[]>(
        dadosAplic.initialItens ?? []
    );

    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);

    useEffect(() => {
        getInsumoAtivo().then((result) => {
            if (result) setInsumos(result);
        });
    }, []);

    function handleRemoverItem(insumo_id: number) {
        setItens(prev => prev.filter(i => i.insumo_id !== insumo_id));
    }

    async function handleSalvar() {
        if (!itens.length) {
            Alert.alert('Atenção', 'Adicione pelo menos um insumo');
            return;
        }

        try {
            console.log('Iniciando criação da aplicação com dados: ', dadosAplic);

            for (const item of itens) {
                const validacao = await validarSaidaSemNegatacao(
                    item.insumo_id,
                    item.quantidade,
                    dadosAplic.proprietyId,
                    item.descricao
                );

                if (!validacao.valido) {
                    Alert.alert('Erro', validacao.mensagem || 'Saldo insuficiente para este item');
                    return;
                }
            }

            const aplic = await createAplic({
                atividade_safra_id: dadosAplic.atividadeSafraId,
                atividade_gleba_id: dadosAplic.atividade_gleba_id,
                maquina_id: dadosAplic.maquina_id,
                operador_id: dadosAplic.operador_id,
                recomendacoes_agricolas_id: dadosAplic.recomendacoes_agricolas_id,
                area_aplic: dadosAplic.areaAplic,
                data_inicio: dadosAplic.data_inicio,
                data_final: dadosAplic.data_fim
            })

            if (!aplic.insertRowId) return Alert.alert('Erro', 'Não foi possível criar a aplicação');
            const aplicacaoId = aplic.insertRowId;

            for (const item of itens) {
                await createAplicacaoItem({
                    aplicacoes_insumo_id: aplicacaoId,
                    insumo_id: item.insumo_id,
                    dose_aplic: item.dose,
                    quantidade_aplic: item.quantidade
                });
            }

            for (const item of itens) {
                await createMovInsumo({
                    insumo_id: item.insumo_id,
                    quantidade: item.quantidade,
                    valor_unitario: 0,
                    aplicacoes_insumo_id: aplicacaoId,
                }, 'S');
            }

            Alert.alert('Sucesso', 'Aplicação registrada com sucesso!');
            navigation.navigate('BottomRoutes', { screen: 'Aplicacoes' });

        } catch (error) {
            console.error('Erro ao salvar aplicação:', error);
            Alert.alert('Erro', 'Não foi possível salvar a aplicação.');
        }

    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <TopButton
                title="Itens da aplicação"
                onCancelar={
                    () => { navigation.navigate('BottomRoutes', { screen: 'Aplicacoes' }) }
                }
            />

            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {itens.length > 0 ? (
                    itens.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemDescricao}>{item.descricao}</Text>
                                <Text style={styles.itemDetalhes}>
                                    Dose: {Number(item.dose).toFixed(2)} {item.unidade}/ha | Qtd: {Number(item.quantidade).toFixed(2)} {item.unidade}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemoverItem(item.insumo_id)}
                            >
                                <Text style={styles.removeText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nenhum insumo adicionado</Text>
                )}
            </ScrollView>

            <View style={styles.addButtonContainer}>
                <ButtonPages
                    title="+ Adicionar insumo"
                    onPress={() => setModalAddItemVisible(true)}
                />
            </View>

            <ButtonAvance
                title="Salvar"
                onSeguir={handleSalvar}
                onVoltar={() => navigation.goBack()}
            />

            <AddItemForm
                mode="recomendacao"
                insumos={insumos}
                areaAplic={dadosAplic.areaAplic}
                isVisible={modalAddItemVisible}
                onClose={() => setModalAddItemVisible(false)}
                onAdd={(item) => {
                    const jaExiste = itens.find(i => i.insumo_id === item.insumo_id);
                    if (jaExiste) return alert('Insumo já adicionado');
                    setItens(prev => [...prev, item]);
                }}
            />


        </KeyboardAvoidingView >
    )
}