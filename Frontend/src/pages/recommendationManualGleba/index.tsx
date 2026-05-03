import React from "react";
import {
    View,
    Text
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import ButtonSelect from "../../components/ButtonSelect";
import { InputText } from "../../components/TextInput";
import ButtonAvance from "../../components/ButtonAvance";

export default function RecommendationManualGleba() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <TopButton title="Recomendação Manual - Gleba"
                onCancelar={
                    () => {navigation.navigate('bottomRoutes' as any, { screen: 'Recomendacoes' })}
                }
            />

            <View style={styles.form}>

                <ButtonSelect
                    title="Gleba da recomendação"
                    text="Selecione a gleba"
                    isRequired={true}
                />

                <ButtonSelect
                    title="Operador responsável"
                    text="Selecione o operador"
                    isRequired={true}
                />

                <InputText
                    title="Area a ser aplicada"
                    placeholder="Digite a área a ser aplicada"
                    isRequired={true}
                    keyboardType="numeric"
                />

            </View>

            <ButtonAvance
                title="Próximo"
                onSeguir={
                    () => navigation.navigate('recomendationManualInsumo')
                }
                onVoltar={
                    () => { navigation.goBack() }
                }
            />
        </View>
    )
}