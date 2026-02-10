import React, { useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';

import { styles } from './styles';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function ButtonBar(props: BottomTabBarProps) {
    const { navigation } = props;
    const currentRoute = props.state.routes[props.state.index].name;
    const isFocusedEstoque = currentRoute === 'Estoque';
    const isFocusedRecomendacoes = currentRoute === 'Recomendacoes';
    const isFocusedHome = currentRoute === 'Home';
    const isFocusedAplicacoes = currentRoute === 'Aplicacoes';
    const isFocusedRelatorios = currentRoute === 'Relatorios';



    const moveButton = (screenName: string) => {
        navigation.navigate(screenName as any);
    }


    return (
        <View style={styles.tabArea}>

                <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => moveButton('Estoque')}
                >
                    <Image
                        source={
                            isFocusedEstoque
                                ? require('../../assets/icon/estoque_active.png')
                                : require('../../assets/icon/estoque.png')
                        }
                        style={styles.image}
                    />
                    <Text style={[styles.text, isFocusedEstoque && styles.textActive]}>
                        Estoque
                    </Text>
                </TouchableOpacity>



                <TouchableOpacity style={styles.tabItem}
                    onPress={() => moveButton('Recomendacoes')}>
                    <Image
                        source={
                            isFocusedRecomendacoes
                                ? require('../../assets/icon/recomendacao_active.png')
                                : require('../../assets/icon/recomendacao.png')
                        }
                        style={styles.image}
                    />
                    <Text style={[styles.text, isFocusedRecomendacoes && styles.textActive]}>
                        Recomendações
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem}
                    onPress={() => moveButton('Home')}>
                    <Image
                        source={
                            isFocusedHome
                                ? require('../../assets/icon/mapa_active.png')
                                : require('../../assets/icon/mapa.png')
                        }
                        style={styles.image}
                    />
                    <Text style={[styles.text, isFocusedHome && styles.textActive]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem}
                    onPress={() => moveButton('Aplicacoes')}>
                    <Image
                        source={
                            isFocusedAplicacoes
                                ? require('../../assets/icon/pulverizacao_active.png')
                                : require('../../assets/icon/pulverizacao.png')
                        }
                        style={styles.image}
                    />
                    <Text style={[styles.text, isFocusedAplicacoes && styles.textActive]}>
                        Aplicações
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem}
                    onPress={() => moveButton('Relatorios')}>
                    <Image
                        source={
                            isFocusedRelatorios
                                ? require('../../assets/icon/relatorio_active.png')
                                : require('../../assets/icon/relatorio.png')
                        }
                        style={styles.image}
                    />
                    <Text style={[styles.text, isFocusedRelatorios && styles.textActive]}>
                        Relatórios
                    </Text>
                </TouchableOpacity>

        </View>
    );
}

