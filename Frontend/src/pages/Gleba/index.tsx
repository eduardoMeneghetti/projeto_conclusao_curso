import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Modal,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
} from "react-native";
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { usePropriety } from "../../context/PropContext";
import { useGlebaDatabase } from "../../database/useGlebas";
import { Ponto } from "../../util/Ponto";
import { useCidadeDatabase } from "../../database/cityStateDatabase";
import { themes } from "../../global/themes";

type GlebaRenderizada = {
    id: number;
    descricao: string;
    pontos: Ponto[];
};

export default function Gleba() {
    const navigation = useNavigation<any>();
    const { selectedPropriety } = usePropriety();
    const { getGlebasWithLatLong, getGlebaInPropriety, deleteGleba } = useGlebaDatabase();
    const mapRef = useRef<MapView>(null);
    const { getCityStateById } = useCidadeDatabase();
    const [glebas, setGlebas] = useState<GlebaRenderizada[]>([]);
    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
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
                    pontos: []
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

    return (
        <View style={styles.container}>
            <TopButton
                title={"Areas da fazenda: " + (selectedPropriety?.descricao || '')}
                onVoltar={() => navigation.navigate('Config')}
            />

            <MapView
                ref={mapRef}
                style={styles.map}
                mapType="hybrid"
                initialRegion={initialRegion}
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
                            setGlebaSelected(gleba);
                            setModalVisible(true);
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

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>{glebaSelected?.descricao}</Text>

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
                                                    setModalVisible(false);
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

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => {
                                setModalVisible(false);
                                setGlebaSelected(null);
                            }}
                        >
                            <Text>Fechar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </View>
    );
}