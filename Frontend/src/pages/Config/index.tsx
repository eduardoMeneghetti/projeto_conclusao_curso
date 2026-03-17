import React from "react";
import {
    View,
    Text,
    Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import Line from "../../components/Line";
import ButtonPages from "../../components/ButtonPages";
import ButtonSelect from "../../components/ButtonSelect";
import LineArround from "../../components/lineArround";
import { usePropriety } from "../../context/PropContext";
import SelectionModal from "../../components/SelectionModal";

export default function Config() {
    const navigation = useNavigation<any>();
    const {
        isModalVisible,
        onOpen,
        onClose,
        selectedPropriety,
        setSelectedPropriety,
        proprieties,
        loadProprieties
    } = usePropriety();

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <ButtonPages title="Voltar"
                    onPress={() => {
                        navigation.navigate('BottomRoutes');
                    }}
                />

                <Line />

                <View style={styles.userContainer}>
                    <Image
                        style={styles.userImage}
                        source={require('../../assets/icon/usuario.png')}
                    />
                    <Text>João Silva</Text>
                    <Text>joao.silva@email.com</Text>
                </View>

                <View style={styles.menus}>

                    <ButtonSelect
                        title="Seleção de propriedade"
                        text={selectedPropriety ? selectedPropriety.descricao : "Selecione uma propriedade"}
                        isRequired={false}
                        onPress={onOpen}
                    />

                    <ButtonSelect
                        title="Usuários"
                        text="Cadastro de usuários"
                        isRequired={false}
                    />

                    <ButtonSelect
                        title="Atividades"
                        text="Cadastro de atividade"
                        isRequired={false}
                        onPress={
                            () => {navigation.navigate('Activity')}
                        }
                    />

                </View>

            </View>

            <SelectionModal
                onEdit={(item) => {
                    onClose();
                    navigation.navigate('Proprieties', { id: item.id });
                }}
                isVisible={isModalVisible}
                onClose={onClose}
                showInactiveToggle={true}
                data={proprieties.map(p => ({
                    id: String(p.id),
                    title: p.descricao,
                    inactive: !p.ativo
                }))}
                selectedId={selectedPropriety ? String(selectedPropriety.id) : null}
                onSelect={(item) => {
                    const prop = proprieties.find(p => String(p.id) === item.id);
                    if (prop) setSelectedPropriety(prop);
                }}
                title="Selecione a Propriedade"
                onAdd={() => {
                    onClose();
                    navigation.navigate('Proprieties' as never);
                }}
                onToggleInactive={(showInactive) => {
                    loadProprieties(showInactive);
                }}
            />

        </View>
    );
}