import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export async function loginApi(usuario: string, senha: string) {
    let response: Response;
    try {
        response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });
    } catch (networkError) {
        console.error('[auth] Erro de rede (HTTP bloqueado ou servidor inacessível):', networkError);
        throw networkError;
    }

    const text = await response.text();
    console.log(`[auth] status: ${response.status}, body: ${text.substring(0, 200)}`);

    let data: any = {};
    try { data = JSON.parse(text); } catch { throw new Error(`Resposta não-JSON (${response.status}): ${text.substring(0, 100)}`); }

    if (response.status === 200) {
        await AsyncStorage.setItem('token', data.token);
        return { success: true, token: data.token };
    }
    return { success: false, error: data.error };
}

export async function getToken() {
    return await AsyncStorage.getItem('token');
}

export async function removeToken() {
    await AsyncStorage.removeItem('token');
}