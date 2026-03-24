// services/syncUsuarios.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { API_URL } from './api';

export async function syncUsuarios(database: SQLiteDatabase) {

    const usuarios = await database.getAllAsync<{
        id: number;
        nome: string;
        usuario: string;
        senha: string;
        email: string;
        operador: number;
        recomendante: number;
        ativo: number;
        is_dirty: number;
        server_id: number | null;
    }>(`SELECT * FROM usuarios WHERE is_dirty = 1`);

    console.log('usuários dirty:', usuarios);

    if (!usuarios.length) {
        console.log('nenhum usuário para sincronizar');
        return;
    }

    const response = await fetch(`${API_URL}/auth/sync_usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarios })
    });

    console.log('status:', response.status);

    const data = await response.json();

    console.log('resposta API:', data);

    if (!data.usuarios) return;

    for (const usuario of data.usuarios) {
        await database.runAsync(
            `UPDATE usuarios 
             SET server_id = $server_id,
                 synced_at = $synced_at,
                 is_dirty = 0
             WHERE id = $local_id`,
            {
                $server_id: usuario.id,
                $synced_at: new Date().toISOString(),
                $local_id: usuario.local_id
            }
        );
    }
}