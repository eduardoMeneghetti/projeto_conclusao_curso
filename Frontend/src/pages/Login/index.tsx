import React from "react";
import {
  Text,
  View,
  Image,
  Animated,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/index.routes';

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

import { styles } from "../Login/styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export default function Login() {
  const navigation = useNavigation<NavigationProps>();
  const [usuario, setUsuario] = React.useState('');
  const [senha, setSenha] = React.useState('');


  function getlogin() {
    try {
      if (!usuario || !senha) {
        return Alert.alert('Atenção', 'Preencha todos os campos!');
      }

      if (usuario === 'admin' && senha === 'admin') {
        Alert.alert('Sucesso', 'Login efetuado com sucesso!');
        navigation.navigate('BottomRoutes');
      } else {
        Alert.alert('Erro', 'Usuário ou senha inválidos!');
      }
    } catch (error) {
      alert(error + " Erro ao efetuar login!");
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.boxTop}>
        <Text style={styles.title}>KHRONOS</Text>
        <Text style={styles.subTitle}>Acesse sua conta</Text>
      </View>

      <View style={styles.boxMid}>
        <Input
          placeholder="Usuário"
          value={usuario}
          onChangeText={setUsuario}
        />

        <Input
          placeholder="Senha"
          isPassword
          value={senha}
          onChangeText={setSenha}
          iconOpen={require('../../assets/icon/olho_login_aberto.png')}
          iconClosed={require('../../assets/icon/olho_login_fechado.png')}
        />


        <Button
          title="Entrar"
          onPress={getlogin}
        />

      </View>


      <View style={styles.boxBottom}>
      </View>

    </View>
  );
} 