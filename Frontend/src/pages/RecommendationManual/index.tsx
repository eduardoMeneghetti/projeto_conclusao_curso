import React from "react";
import {
    View
} from 'react-native'
import { styles } from "./styles";
import { TopButton } from "../../components/TopButton";
import { useNavigation } from "@react-navigation/native";
import ButtonSelect from "../../components/ButtonSelect";
import ButtonAvance from "../../components/ButtonAvance";
import { InputDate } from "../../components/InputDate";

export default function RecommendationManual() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <TopButton title="Recomendação Manual"
                onCancelar={
                    () => navigation.goBack()
                }
            />

            <View style={styles.form}>

                <ButtonSelect
                    title="Propriedade"
                    text="Propriedade selecionada"
                    isRequired={true}
                />

                <View style={styles.safraAtividade}>
                    <ButtonSelect
                        title="safra"
                        text="2025/2026 FEIJAO"
                        isRequired={true}
                    />

                    <ButtonSelect
                        title="atividade"
                        text="FEIJAO"
                        isRequired={true}
                    />
                </View>

                <ButtonSelect
                    title="Recomendante"
                    text="Bruno"
                    isRequired={true}
                />

                <InputDate
                    title="Data da recomendação"
                    value={new Date()}
                    onChange={() => { }}
                    isRequired={true}
                />

            </View>

            <ButtonAvance
                title="Próximo"
                onSeguir={
                    () => navigation.navigate('RecommendationManualGleba')
                }
            />

        </View>
    )
}