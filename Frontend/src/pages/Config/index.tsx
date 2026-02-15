import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import Line from "../../components/Line";
import ButtonPages from "../../components/ButtonPages";
import ButtonSelect from "../../components/ButtonSelect";
import LineArround from "../../components/lineArround";

export default function Config() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>

            <View style={styles.topContainer}>
                <ButtonPages
                    onPress={() => navigation.goBack()}
                    title="Voltar"
                />

                <Line />

                <View style={styles.userContainer}>
                    <Image
                        style={styles.userImage}
                        source={require('../../assets/icon/usuario.png')}
                    />
                    <Text>
                        João Silva
                    </Text>

                    <Text>
                        joao.silva@email.com
                    </Text>
                </View>

                <LineArround />

                <ButtonSelect
                    title="Seleção de propriedade"
                    text="Popriedade teste"
                    isRequired={false}
                />

                <LineArround />

                <ButtonSelect
                    title="Usuários"
                    text="Cadastro de usuários"
                    isRequired={false}
                />

                <LineArround />

            </View>
        </View>
    );
}

