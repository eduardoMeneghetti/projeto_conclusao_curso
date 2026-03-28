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
import { useUserDatabase } from '../../database/useUserDatabase'
import NetInfo from '@react-native-community/netinfo';
import { loginApi } from '../../services/auth';

type NavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

import { styles } from "../Login/styles";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigation = useNavigation<NavigationProps>();
  const [usuario, setUsuario] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const { getByCrendentials } = useUserDatabase();
  const { signIn } = useAuth();

  async function getlogin() {
    if (!usuario || !senha) {
      return Alert.alert('Atenção', 'Preencha todos os campos!');
    }

    // 1. autentica localmente
    const user = await getByCrendentials(usuario, senha);
    if (!user) {
      return Alert.alert('Erro', 'Usuário ou senha inválidos!');
    }

    // 2. se tiver conexão, autentica na API
    const { isConnected } = await NetInfo.fetch();
    if (isConnected) {
      const result = await loginApi(usuario, senha);
      if (result.success) {
        console.log('Token gerado com sucesso!');
      }
    }

    signIn(user);
    navigation.reset({ index: 0, routes: [{ name: 'BottomRoutes' }] });
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
          onChangeText={(text) => setUsuario(text.toLowerCase())}
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

