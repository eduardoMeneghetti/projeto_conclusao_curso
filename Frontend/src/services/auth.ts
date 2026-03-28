import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export async function loginApi(usuario: string, senha: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
    });

    const data = await response.json();

    if (response.status === 200) {
        await AsyncStorage.setItem('token', data.token);
        return { success: true, token: data.token };
    }
    console.log('Token gerado com Sucesso: ', data.token)
    return { success: false, error: data.error };
}

export async function getToken() {
    return await AsyncStorage.getItem('token');
}

export async function removeToken() {
    await AsyncStorage.removeItem('token');
}