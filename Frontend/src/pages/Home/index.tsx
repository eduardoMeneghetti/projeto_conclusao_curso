import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { styles } from "./styles";
import MapView, { Marker, Polygon, MapPressEvent } from "react-native-maps";
import { useNavigation } from "@react-navigation/core";
import { useFab } from "../../context/fabContext";
import { usePropriety } from "../../context/PropContext";
import { useCidadeDatabase } from "../../database/cityStateDatabase";
import { useSQLiteContext } from "expo-sqlite";
import { InputText } from "../../components/TextInput";
import * as turf from '@turf/turf';
import { themes } from "../../global/themes";
import { UseGleba, useGlebaDatabase } from "../../database/useGlebas";
import { Ponto } from "../../util/Ponto";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthSelection } from '../../context/selectionContext';
import { useActivityGlebaDatabase } from "../../database/useActivityGlebaDatabase";
import { usePropDatabase } from "../../database/usePropDatabase";


type GlebaRenderizada = {
    id: number;
    descricao: string;
    pontos: Ponto[];
    cor: string;  
};

export default function Home() {
    const { setAction } = useFab();
    const navigation = useNavigation<any>();
    const { selectedPropriety } = usePropriety();
    const { selectedAtividadeSafraId } = useAuthSelection();
    const { createGlebaWithPontos, getGlebasWithLatLong, getGlebasInActivity } = useGlebaDatabase();
    const { createActivityGleba, getColorGlebaById } = useActivityGlebaDatabase();
    const { updateAreaPropriety } = usePropDatabase();
    const [glebas, setGlebas] = useState<GlebaRenderizada[]>([]);
    const database = useSQLiteContext();

    const mapRef = useRef<MapView>(null);
    const [modoDesenho, setModoDesenho] = useState(false);
    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [nomeGleba, setNomeGleba] = useState('');
    const [initialRegion, setInitialRegion] = useState({
        latitude: -27.6305,
        longitude: -52.2364,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });


    async function loadGlebas() {
        if (!selectedAtividadeSafraId) return;

        const cor = await getColorGlebaById(selectedAtividadeSafraId) ?? themes.colors.gray + '80';

        const rows = await getGlebasInActivity(selectedAtividadeSafraId);
        const glebasMap = new Map<number, GlebaRenderizada>();

        for (const row of rows) {
            if (!glebasMap.has(row.id)) {
                glebasMap.set(row.id, {
                    id: row.id,
                    descricao: row.descricao,
                    pontos: [],
                    cor
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
    }, [selectedAtividadeSafraId]);

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
                    const cidade = await database.getFirstAsync<{ latitude: number, longitude: number }>(
                        `SELECT latitude, longitude FROM cidades WHERE id = $id`,
                        { $id: selectedPropriety.cidade_id }
                    );

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
        loadGlebas();
    }, [selectedPropriety]);


    useEffect(() => {
        setAction(() => () => {
            setPontos([]);
            setModoDesenho(true);
        });

        return () => setAction(null);
    }, []);

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
                setModalVisible(true);
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
        if (!selectedAtividadeSafraId) return alert('Selecione uma safra antes de criar a gleba');

        const areaHectares = calcularAreaHectares();

        try {
            const result = await createGlebaWithPontos(
                {
                    descricao: nomeGleba,
                    area_hectares: areaHectares,
                    propriedade_id: selectedPropriety.id
                },
                pontos
            );

            if (result?.insertedRowId) {
                await createActivityGleba({
                    gleba_id: Number(result.insertedRowId),
                    atividade_safra_id: selectedAtividadeSafraId
                });
                console.log(`Gleba associada à atividade_safra ${selectedAtividadeSafraId}`);
            }

            console.log(`Gleba ${nomeGleba} criada com ${pontos.length} pontos e ${areaHectares.toFixed(2)} hectares!`);

            setNomeGleba('');
            setPontos([]);
            setModoDesenho(false);
            setModalVisible(false);
            loadGlebas();
            
        } catch (error) {
            console.error('Erro ao salvar gleba:', error);
            alert('Erro ao salvar gleba');
        }
    }

    return (
        <View style={styles.container}>

            {modoDesenho && (
                <View style={styles.drawingBar}>
                    <Text style={styles.drawingText}>
                        {pontos.length < 3
                            ? `Marque os pontos para criar a gleba (${pontos.length} pontos)`
                            : `Toque no primeiro ponto para fechar (${pontos.length} pontos)`
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
                        fillColor={gleba.cor + '80'}
                        strokeColor="green"
                        strokeWidth={1}
                        tappable
                        onPress={() => Alert.alert(gleba.descricao)}
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


            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ width: '100%' }}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Nome da gleba</Text>

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
                                        setModalVisible(false);
                                        setPontos([]);
                                        setModoDesenho(false);
                                    }}
                                    style={styles.cancelButton}
                                >
                                    <Text>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleSalvarGleba}
                                    style={styles.confirmButton}
                                >
                                    <Text>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

        </View>
    );
}