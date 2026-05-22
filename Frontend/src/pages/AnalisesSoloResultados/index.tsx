import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { TopButton } from "../../components/TopButton";
import ButtonAvance from "../../components/ButtonAvance";
import SelectionModal from "../../components/SelectionModal";
import { styles } from "./styles";
import {
    calcularDoseP, calcularDoseK, calcularDoseN,
    calcularQuantidadeInsumo, calcularTotalArea, normalizarAtividade,
} from "../../util/dosesAdubacao";
import { PrincipioAtivoResult, UsePrincipiosAtivosNutrientes } from "../../database/UsePrincipiosAtivosNutrientes";
import { useInsumoDatabase } from "../../database/useInsumoDatabase";
import { RecomendacaoItem } from "../../components/AddItemForm";

type InsumoItem = { id: number; descricao: string };

type NutrienteState = {
    principio: PrincipioAtivoResult | null;
    insumos: InsumoItem[];
    selected: InsumoItem | null;
};

const INICIAL: NutrienteState = { principio: null, insumos: [], selected: null };

export default function AnalisesSoloResultados() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dados = route.params;

    const { getInsumosByNutriente } = UsePrincipiosAtivosNutrientes();
    const { getInsumosByPrincipioAtivo } = useInsumoDatabase();

    const qtdArea   = Number(dados?.qtd_area ?? 0);
    const classeP   = dados?.classeP  ?? '';
    const classeK   = dados?.classeK  ?? '';
    const classeMO  = dados?.classeMO ?? '';
    const atividade = normalizarAtividade(dados?.atividade_descricao ?? '');

    const doseP = useMemo(() => calcularDoseP(classeP),              [classeP]);
    const doseK = useMemo(() => calcularDoseK(classeK),              [classeK]);
    const doseN = useMemo(() => calcularDoseN(classeMO, atividade),  [classeMO, atividade]);

    const [estadoP, setEstadoP] = useState<NutrienteState>(INICIAL);
    const [estadoK, setEstadoK] = useState<NutrienteState>(INICIAL);
    const [estadoN, setEstadoN] = useState<NutrienteState>(INICIAL);
    const [modalTarget, setModalTarget] = useState<'P' | 'K' | 'N' | null>(null);

    async function carregarNutriente(
        sigla: string,
        setEstado: React.Dispatch<React.SetStateAction<NutrienteState>>,
    ) {
        const resultados = await getInsumosByNutriente(sigla);
        if (!resultados.length) return;
        const melhor = resultados[0];
        const insumos = await getInsumosByPrincipioAtivo(melhor.id);
        setEstado({
            principio: melhor,
            insumos,
            selected: insumos.length === 1 ? insumos[0] : null,
        });
    }

    useEffect(() => {
        carregarNutriente('P2O5', setEstadoP);
        carregarNutriente('K2O',  setEstadoK);
        carregarNutriente('N',    setEstadoN);
    }, []);

    function onModalSelect(item: { id: string; title: string }) {
        const estado = modalTarget === 'P' ? estadoP : modalTarget === 'K' ? estadoK : estadoN;
        const setEstado = modalTarget === 'P' ? setEstadoP : modalTarget === 'K' ? setEstadoK : setEstadoN;
        const found = estado.insumos.find(i => String(i.id) === item.id) ?? null;
        setEstado(prev => ({ ...prev, selected: found }));
        setModalTarget(null);
    }

    const modalEstado = modalTarget === 'P' ? estadoP : modalTarget === 'K' ? estadoK : estadoN;

    function NutrienteCard({
        titulo, dose, estado, target,
    }: {
        titulo: string;
        dose: number;
        estado: NutrienteState;
        target: 'P' | 'K' | 'N';
    }) {
        if (dose === 0) {
            return (
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>{titulo}</Text>
                    <Text style={styles.value}>Não requer adubação</Text>
                </View>
            );
        }

        const qtdHa    = estado.principio ? calcularQuantidadeInsumo(dose, estado.principio.percentual) : 0;
        const totalArea = calcularTotalArea(qtdHa, qtdArea);

        return (
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>{titulo}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Princípio ativo</Text>
                    <Text style={styles.value}>
                        {estado.principio?.descricao ?? '—'}{estado.principio ? ` (${estado.principio.percentual}%)` : ''}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Insumo</Text>
                    {estado.insumos.length > 1 ? (
                        <TouchableOpacity style={styles.selectButton} onPress={() => setModalTarget(target)}>
                            <Text style={styles.selectButtonText}>
                                {estado.selected?.descricao ?? 'Selecionar'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.value}>{estado.selected?.descricao ?? '—'}</Text>
                    )}
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Dose do nutriente</Text>
                    <Text style={styles.destaque}>{dose} kg/ha</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Qtd. insumo/ha</Text>
                    <Text style={styles.destaque}>{qtdHa.toFixed(1)} kg/ha</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Total ({qtdArea.toFixed(1)} ha)</Text>
                    <Text style={styles.value}>{totalArea.toFixed(1)} kg</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Resultado da análise"
                onCancelar={() => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })}
            />

            <ScrollView style={styles.form}>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Parâmetros do solo</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Argila</Text>
                        <Text style={styles.value}>{dados?.argila} % — {dados?.classeArgila}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Mat. Orgânico</Text>
                        <Text style={styles.value}>{dados?.materialOrganico} % — {classeMO}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CTC</Text>
                        <Text style={styles.value}>{dados?.ctc} — {dados?.classeCTC}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fósforo (P)</Text>
                        <Text style={styles.value}>{dados?.fosforo} mg/dm³ — {classeP}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Potássio (K)</Text>
                        <Text style={styles.value}>{dados?.potassio} mg/dm³ — {classeK}</Text>
                    </View>
                </View>

                <NutrienteCard titulo="Fósforo (P₂O₅)" dose={doseP} estado={estadoP} target="P" />
                <NutrienteCard titulo="Potássio (K₂O)"  dose={doseK} estado={estadoK} target="K" />
                <NutrienteCard titulo="Nitrogênio (N)"   dose={doseN} estado={estadoN} target="N" />

            </ScrollView>

            <ButtonAvance
                title="Próximo"
                onSeguir={() => {
                    const initialItens: RecomendacaoItem[] = [];

                    if (doseP > 0 && estadoP.selected && estadoP.principio) {
                        const qtdHa = calcularQuantidadeInsumo(doseP, estadoP.principio.percentual);
                        initialItens.push({
                            insumo_id: estadoP.selected.id,
                            descricao: estadoP.selected.descricao,
                            dose: qtdHa,
                            quantidade: calcularTotalArea(qtdHa, qtdArea),
                            unidade: 'kg',
                        });
                    }
                    if (doseK > 0 && estadoK.selected && estadoK.principio) {
                        const qtdHa = calcularQuantidadeInsumo(doseK, estadoK.principio.percentual);
                        initialItens.push({
                            insumo_id: estadoK.selected.id,
                            descricao: estadoK.selected.descricao,
                            dose: qtdHa,
                            quantidade: calcularTotalArea(qtdHa, qtdArea),
                            unidade: 'kg',
                        });
                    }
                    if (doseN > 0 && estadoN.selected && estadoN.principio) {
                        const qtdHa = calcularQuantidadeInsumo(doseN, estadoN.principio.percentual);
                        initialItens.push({
                            insumo_id: estadoN.selected.id,
                            descricao: estadoN.selected.descricao,
                            dose: qtdHa,
                            quantidade: calcularTotalArea(qtdHa, qtdArea),
                            unidade: 'kg',
                        });
                    }

                    navigation.navigate('RecommendationManual', {
                        atividade_safra_id: dados.atividade_safra_id,
                        atividade_gleba_id: dados.atividade_gleba_id,
                        area_aplic: qtdArea,
                        analise_solo_id: dados.analise_solo_id,
                        initialItens,
                    });
                }}
            />

            <SelectionModal
                isVisible={modalTarget !== null}
                onClose={() => setModalTarget(null)}
                title="Selecione o insumo"
                data={modalEstado.insumos.map(i => ({ id: String(i.id), title: i.descricao }))}
                selectedId={modalEstado.selected ? String(modalEstado.selected.id) : null}
                onSelect={onModalSelect}
            />
        </View>
    );
}