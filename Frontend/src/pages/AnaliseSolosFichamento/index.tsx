import React, { useState } from "react";
import {
    View,
    Text,
    Alert
} from 'react-native'
import { TopButton } from "../../components/TopButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles } from "./styles";
import ButtonAvance from "../../components/ButtonAvance";
import { InputText } from "../../components/TextInput";

export default function AnaliseSolosFichamento() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dadosAnaliseSolo = route.params;

    const {classificarParametro} = UseAnaliseClassificacao();

    const [argila, setArgila] = useState('');
    const [materialOrganico, setMaterialOrganico] = useState('');
    const [ctc, setCtc] = useState('');

    async function handleSalvar(){
        if(!argila || !materialOrganico || !ctc) return Alert.alert("Atenção", "Ao menos um parâmetro deve ser preenchido!")
        
        const classeArgila = await classificarParametro(1, Number(argila));  
        const classeMO     = await classificarParametro(2, Number(materialOrganico));      
        const classeCTC    = await classificarParametro(3, Number(ctc));     

        navigation.navigate('AnaliseNPK', 
            ...dadosAnaliseSolo,
            classeArgila,
            classeMO,
            classeCTC,
            argila,
            materialOrganico,
            ctc
        )

    }

    return (
        <View style={styles.container}>
            <TopButton
                title="Informe os resultados da analise"
                onCancelar={
                    () => navigation.navigate('BottomRoutes' as any, { screen: 'Recomendacoes' })
                }
            />

            <View style={styles.form}>

                <InputText
                    title="Argila: "
                    placeholder="Digite o valor da Argila"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={argila}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setArgila(text);
                    }}
                />

                <InputText
                    title="Máterial Orgânico: "
                    placeholder="Digite o valor do Máterial Orgânico"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={materialOrganico}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setMaterialOrganico(text);
                    }}
                />

                <InputText
                    title="CTC: "
                    placeholder="Digite o valor do CTC"
                    isRequired={true}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    value={ctc}
                    onChangeText={(text) => {
                        if (/^\d*[.,]?\d{0,2}$/.test(text)) setCtc(text);
                    }}
                />


            </View>

            <ButtonAvance
                title="Próximo"
                onSeguir={() => (handleSalvar)}
                onVoltar={() => navigation.goBack()}
            />
        </View>
    )
}

function UseAnaliseClassificacao(): { classificarParametro: any; } {
    throw new Error("Function not implemented.");
}
