import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Alert,
    Modal,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
} from "react-native";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polygon, MapPressEvent } from "react-native-maps";
import { usePropriety } from "../../context/PropContext";
import { useGlebaDatabase } from "../../database/useGlebas";
import { Ponto } from "../../util/Ponto";
import { useCidadeDatabase } from "../../database/cityStateDatabase";
import { themes } from "../../global/themes";
import { InputText } from "../../components/TextInput";
import * as turf from '@turf/turf';

type GlebaRenderizada = {
    id: number;
    descricao: string;
    pontos: Ponto[];
    area: number;
};

export default function Gleba() {
    const navigation = useNavigation<any>();
    const { selectedPropriety } = usePropriety();
    const { createGlebaWithPontos, getGlebasWithLatLong, getGlebaInPropriety, deleteGleba } = useGlebaDatabase();
    const mapRef = useRef<MapView>(null);
    const { getCityStateById } = useCidadeDatabase();

    const [glebas, setGlebas] = useState<GlebaRenderizada[]>([]);
    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [modoDesenho, setModoDesenho] = useState(false);
    const [nomeGleba, setNomeGleba] = useState('');

    const [modalExcluir, setModalExcluir] = useState(false);
    const [modalSalvar, setModalSalvar] = useState(false);
    const [glebaSelected, setGlebaSelected] = useState<GlebaRenderizada | null>(null);

    const [initialRegion, setInitialRegion] = useState({
        latitude: -27.6305,
        longitude: -52.2364,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    async function loadGlebas() {
        if (!selectedPropriety) return;

        const rows = await getGlebaInPropriety(selectedPropriety.id);
        const glebasMap = new Map<number, GlebaRenderizada>();

        for (const row of rows) {
            if (!glebasMap.has(row.id)) {
                glebasMap.set(row.id, {
                    id: row.id,
                    descricao: row.descricao,
                    pontos: [],
                    area: row.area_hectares
                });
            }
            glebasMap.get(row.id)?.pontos.push({
                latitude: row.latitude,
                longitude: row.longitude
            });
        }

        setGlebas(Array.from(glebasMap.values()));
    }

    useEffect(() => {
        loadGlebas();
    }, [selectedPropriety]);

    useEffect(() => {
        async function loadInitialRegion() {
            if (!selectedPropriety) return;

            try {
                const glebas = await getGlebasWithLatLong(selectedPropriety.id);

                if (glebas && glebas.length > 0) {
                    mapRef.current?.animateToRegion({
                        latitude: glebas[0].latitude,
                        longitude: glebas[0].longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                } else {
                    const cidade = await getCityStateById(selectedPropriety.cidade_id);

                    if (cidade?.latitude && cidade?.longitude) {
                        mapRef.current?.animateToRegion({
                            latitude: cidade.latitude,
                            longitude: cidade.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05
                        });
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar região inicial", error);
            }
        }

        loadInitialRegion();
    }, [selectedPropriety]);

    function handleMapPress(event: MapPressEvent) {
        if (!modoDesenho) return;

        const novoPonto = event.nativeEvent.coordinate;

        if (pontos.length >= 3) {
            const primeiroPonto = pontos[0];
            const distancia = Math.sqrt(
                Math.pow(novoPonto.latitude - primeiroPonto.latitude, 2) +
                Math.pow(novoPonto.longitude - primeiroPonto.longitude, 2)
            );

            if (distancia < 0.0003) {
                setModalSalvar(true);
                return;
            }
        }

        setPontos(prev => [...prev, novoPonto]);
    }

    function calcularAreaHectares(): number {
        if (pontos.length < 3) return 0;

        const coordenadas = pontos.map(p => [p.longitude, p.latitude]);
        coordenadas.push(coordenadas[0]);

        const poligono = turf.polygon([coordenadas]);
        const area = turf.area(poligono);

        return area / 10000;
    }

    async function handleSalvarGleba() {
        if (!nomeGleba) return alert('Nome obrigatório');
        if (!selectedPropriety) return alert('Selecione uma propriedade');

        const areaHectares = calcularAreaHectares();

        try {
            await createGlebaWithPontos(
                {
                    descricao: nomeGleba,
                    area_hectares: areaHectares,
                    propriedade_id: selectedPropriety.id
                },
                pontos
            );

            setNomeGleba('');
            setPontos([]);
            setModoDesenho(false);
            setModalSalvar(false);
            loadGlebas();
        } catch (error) {
            console.error('Erro ao salvar gleba:', error);
            alert('Erro ao salvar gleba');
        }
    }

    return (
        <View style={styles.container}>
            <TopButton
                title={"Areas da fazenda: " + (selectedPropriety?.descricao || '')}
                onVoltar={() => navigation.navigate('Config')}
            />

            {modoDesenho && (
                <View style={styles.drawingBar}>
                    <Text style={styles.drawingText}>
                        {pontos.length < 3
                            ? `Marque os pontos da gleba (${pontos.length} pontos)`
                            : `Toque no 1º ponto para fechar (${pontos.length} pontos)`
                        }
                    </Text>
                    <TouchableOpacity onPress={() => {
                        setPontos([]);
                        setModoDesenho(false);
                    }}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}

            <MapView
                ref={mapRef}
                style={styles.map}
                mapType="hybrid"
                initialRegion={initialRegion}
                onPress={handleMapPress}
            >
                {glebas.map((gleba) => (
                    <Polygon
                        key={gleba.id}
                        coordinates={gleba.pontos}
                        fillColor={themes.colors.gray + "80"}
                        strokeColor="green"
                        strokeWidth={1}
                        tappable
                        onPress={() => {
                            if (modoDesenho) return;
                            setGlebaSelected(gleba);
                            setModalExcluir(true);
                        }}
                    />
                ))}

                {pontos.map((ponto, index) => (
                    <Marker
                        key={index}
                        coordinate={ponto}
                        pinColor={index === 0 ? 'green' : 'red'}
                    />
                ))}

                {pontos.length >= 3 && (
                    <Polygon
                        coordinates={pontos}
                        fillColor={themes.colors.tertiary}
                        strokeColor="green"
                        strokeWidth={2}
                    />
                )}
            </MapView>

            {!modoDesenho && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {
                        if (!selectedPropriety) {
                            Alert.alert('Atenção', 'Selecione uma propriedade antes de criar uma gleba.');
                            return;
                        }
                        setPontos([]);
                        setModoDesenho(true);
                    }}
                >
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}


            <Modal visible={modalExcluir} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Text style={styles.modalTitle}>{`${glebaSelected?.descricao} (${(glebaSelected?.area)?.toFixed(2)} Ha)`}</Text>

                            <TouchableOpacity
                                onPress={
                                    () => {
                                        setModalExcluir(false);
                                        setGlebaSelected(null);
                                    }
                                }
                            >
                                <Text style={styles.closeModalText}>fechar</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => {
                                Alert.alert(
                                    "Excluir área",
                                    `Deseja excluir a área "${glebaSelected?.descricao}"?`,
                                    [
                                        { text: "Cancelar", style: "cancel" },
                                        {
                                            text: "Excluir",
                                            style: "destructive",
                                            onPress: async () => {
                                                if (glebaSelected) {
                                                    await deleteGleba(glebaSelected.id);
                                                    setModalExcluir(false);
                                                    setGlebaSelected(null);
                                                    await loadGlebas();
                                                }
                                            }
                                        }
                                    ]
                                );
                            }}
                        >
                            <Text style={styles.deleteText}>Excluir área</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>


            <Modal visible={modalSalvar} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%' }}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Nova gleba</Text>

                            <InputText
                                title="Descrição:"
                                isRequired={true}
                                value={nomeGleba}
                                onChangeText={setNomeGleba}
                            />

                            <Text style={styles.areaText}>
                                Área: {calcularAreaHectares().toFixed(2)} hectares
                            </Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalSalvar(false);
                                        setPontos([]);
                                        setModoDesenho(false);
                                        setNomeGleba('');
                                    }}
                                    style={styles.cancelButton}
                                >
                                    <Text>cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleSalvarGleba}
                                    style={styles.confirmButton}
                                >
                                    <Text style={{ color: themes.colors.white, fontWeight: 'bold' }}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}
